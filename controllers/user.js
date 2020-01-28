const model = require("../model");

module.exports = {
  single: async function (ctx) {
    const userId = ctx.params.id
    let existed = await model.User.findOne({
      where: { id: userId },
      attributes: model.UserAttrs
    });
    let latestKycRecord = null
    if (existed.kycState === 1) {
      latestKycRecord = await model.Kyc.findOne({
        where: { resultMessage: 'SUCCESS', userId: existed.id },
        attributes: ["resultCode", "resultMessage", "errorMessage", "realName", "realId", "uniqueHash", "passedAt"],
        order: [["createdAt", "DESC"]]
      });
    } else {
      latestKycRecord = await model.Kyc.findOne({
        where: { userId: existed.id },
        attributes: ["resultCode", "resultMessage", "errorMessage", "realName", "realId", "uniqueHash", "passedAt"],
        order: [["createdAt", "DESC"]]
      });
    }
    existed = existed.get({ plain: true })
    existed.kyc = latestKycRecord
    ctx.body = { status: 'success', data: existed };
  }
}
