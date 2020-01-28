const buildOnChainRecord = function (user, action, payload) {
  switch (action) {
    case 'NEW_REQ':
      return {
        a: action,
        id: payload.requirementId,
        op_id: user.id,
      }
    case 'UPDATE_REQ':
      return {
        a: action,
        id: payload.requirementId,
        txid: payload.requirementTxId,
        op_id: user.id,
      }
    case 'CHANGE_STATUS':
      return {
        a: action,
        id: payload.requirementId,
        txid: payload.requirementTxId,
        stat: payload.status,
        op_id: user.id,
      }
    case 'NEW_ATTACHMENT':
      return {
        a: action,
        id: payload.requirementId,
        text: payload.text,
        op_id: user.id,
      }
  }
}

module.exports = {
  buildOnChainRecord
}