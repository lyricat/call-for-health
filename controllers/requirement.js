const model = require("../model");
const metadb = require("../metadb");
const config = require("../config.json");
const { buildOnChainRecord } = require('../utils/view')

module.exports = {
  list: async function(ctx) {
    let records = await model.Requirement.findAll({
      where: { status: model.RequirementStatus.CONFIRMED },
      include: [{
        model: model.User,
        attributes: model.UserAttrs,
        as: 'creator'
      }],
    })
    ctx.body = { status: 'success', data: records };
  },

  listMine: async function(ctx) {
    let records = await model.Requirement.findAll({
      where: {
        status: model.RequirementStatus.CONFIRMED,
        creatorId: ctx.state.user.id
      },
      include: [{
        model: model.User,
        attributes: model.UserAttrs,
        as: 'creator'
      }],
    })
    ctx.body = { status: 'success', data: records };
  },

  listAttachments: async function (ctx) {
    const requirementId = ctx.params.id
    let records = await model.Attachment.findAll({
      where: { requirementId: requirementId },
      include: [{
        model: model.User,
        attributes: model.UserAttrs,
        as: 'creator'
      }],
    })
    ctx.body = { status: 'success', data: records };
  },

  single: async function(ctx) {
    let id = ctx.params.id;
    let record = await model.Requirement.findOne({
      where: { id: id},
      include: [{
        model: model.User,
        attributes: model.UserAttrs,
        as: 'creator'
      }],
    })
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

    if (createData.text.length === 0
      || createData.products.length === 0
      || createData.contacts.length === 0
      || createData.location.length === 0) {
      ctx.body = { status: 401, error: 'Invalid content'};
      return;
    }

    var resp, txId;
    // 1. insert into db
    let item = await model.Requirement.create({
      creatorId: user.id,
      txId: '',
      text: createData.text,
      location: createData.location,
      contacts: createData.contacts,
      products: createData.products
    });

    if (config.network_gateway.enabled) {
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
    }

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
      let resp = {};
      let txId = '';

      if (config.network_gateway.enabled) {
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
  },

  handleCreateAttachment: async function(ctx) {
    const requirementId = ctx.params.id
    const attachmentData = ctx.request.body;
    const user = ctx.state.user;
    let data = attachmentData.data
    let txId = '';
    // 1. insert into db
    let item = await model.Attachment.create({
      creatorId: user.id,
      requirementId: requirementId,
      txId: '',
      type: 'TEXT',
      data: data
    });

    if (config.network_gateway.enabled) {
      // 2. create a item in network
      try {
        const onChainData = buildOnChainRecord(user, 'NEW_ATTACHMENT', {
          requirementId: item.id,
          text: data.slice(0, 128)
        })
        const resp = await metadb.seal(onChainData);
        txId = resp.data.transaction_hash;
      } catch (e) {
        ctx.body = { status: 503, error: "Failed to write to TestNet: " + e.message};
        return;
      }

      // 3. update tx id
      item.update({ txId: txId })
    }

    let itemExported = item.get({ plain: true });
    itemExported.creator = user.get({ plain: true });
    ctx.body = { status: 'success', data: itemExported };
  }
};
