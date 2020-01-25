const model = require("../model");
const metadb = require("../metadb");

const buildOnChainRecord = function (user, action, payload) {
  switch (action) {
    case 'NEW_REQ':
      return {
        a: action,
        id: payload.requirementId,
        op_id: user.id,
        conn: [
          { id: user.weiboId, t: "wb" }
        ],
      }
    case 'CHANGE_STATUS':
      return {
        a: action,
        id: payload.requirementId,
        txid: payload.requirementTxId,
        stat: payload.status,
        op_id: user.id,
        conn: [
          { id: user.weiboId, t: "wb" }
        ],
      }
  }
}

module.exports = {
  list: async function(ctx) {
    let records = await model.Requirement.findAll({
      where: { status: model.RequirementStatus.CONFIRMED }
    })
    ctx.body = { status: 'success', data: records };
  },

  single: async function(ctx) {
    let id = ctx.params.id;
    let record = await model.Requirement.findByPk(id)
    if (record && record.status === model.RequirementStatus.CONFIRMED) {
      ctx.body = { status: 'success', data: record };
    } else {
      ctx.body = { status: 404, error: 'not found'}
    }
  },

  singleWithTxId: async function(ctx) {
    let txId = ctx.params.txId;
    let record = await metadb.single({
      txId: txId
    });
    ctx.body = { status: 'success', data: record };
  },

  handleCreate: async function(ctx) {
    let createData = ctx.request.body;
    let user = ctx.state.user;
    let products = []

    if (createData.text.length === 0 || createData.products.length === 0) {
      ctx.body = { status: 401, error: 'Invalid content'};
      return;
    }
    for (let index = 0; index < createData.products.length; index++) {
      const productId = createData.products[index];
      const count = await model.Product.count({ where: { id: productId } })
      if (count !== 0) {
        products.push(productId)
      }
    }

    let text = createData.text;
    var resp, txId;
    // 1. insert into db
    let item = await model.Requirement.create({
      creatorId: user.id,
      txId: '',
      text: text,
      products: products
    });

    // 2. create a item in network
    try {
      const onChainData = buildOnChainRecord(user, 'NEW_REQ', {requirementId: item.id})
      resp = await metadb.seal(onChainData);
      txId = resp.data.transaction_hash;
    } catch (e) {
      ctx.body = { status: 503, error: "Failed to write to TestNet: " + e.message};
      return;
    }

    // 3. update tx id
    item.update({ txId: txId })

    let itemExported = item.get({ plain: true });
    itemExported.creator = user.get({ plain: true });
    ctx.body = { status: 'success', data: itemExported };
  },

  handleUpdateStatus: async function(ctx) {
    const id = ctx.params.id;
    const user = ctx.state.user;
    const updateData = ctx.request.body;

    // only allow updating status
    if (updateData.status in model.RequirementStatus) {
      const record = await model.Requirement.findByPk(id);
      if (record === null) {
        ctx.body = { status: 404, error: 'not found'}
        return
      }
      var resp, txId;

      // 1. create a item in network
      try {
        const onChainData = buildOnChainRecord(user, 'CHANGE_STATUS', {
          requirementId: record.id,
          requirementTxId: record.latestTxId || record.txId,
          status: updateData.status
        })
        resp = await metadb.seal(onChainData);
        txId = resp.data.transaction_hash;
      } catch (e) {
        ctx.body = { status: 503, error: "failed to write to TestNet: " + e.message};
        return;
      }

      // 2. update the db record
      record.update({
        status: updateData.status,
        latestTxId: txId
      })

      ctx.body = { status: 'success', data: record }
    } else {
      ctx.body = { status: 403, error: 'incorrect request'}
    }
  }
};
