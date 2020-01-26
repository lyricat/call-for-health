const kyc = require("../utils/kyc");
const model = require("../model");
const cryptoUtils = require("../utils/crypto-utils");

const run = function() {
  console.log("KYC watch is runing");
  setTimeout(async () => {
    try {
      const rows = await kyc.faceIdGetPendingRecords();
      console.log("check kyc status", rows.length);
      for (let i = 0; i < rows.length; i++) {
        try {
          const resp = await kyc.faceIdGetResult(rows[i].bizToken);
          const result = resp.data
          if (result.error) {
            rows[i].update({
              errorMessage: result.error,
              resultCode: result.result_code,
              resultMessage: result.result_message
            });
            continue;
          }

          // Write record result to db
          let recordPayload = {
            resultCode: result.result_code,
            resultMessage: result.result_message
          }
          if (result.result_code === 1000 || result.result_code === 1001) {
            let idcardInfo = result.idcard_result
            idcardInfo.image_portrait = null
            const uniqueHash = cryptoUtils.sha1HashHex(`CN-IDCARD-${idcardInfo.idcard_number}`)
            // check existence
            const existed = await model.Kyc.findOne({
              where: { uniqueHash: uniqueHash }
            });
            if (existed) {
              recordPayload.errorMessage = 'KYC_RECORD_EXISTED'
              rows[i].update(recordPayload);
              continue
            }
            // console.log("idcard result: ", idcardInfo);
            const encryptedIdcardInfo = kyc.encryptKycResult(idcardInfo)
            // console.log("encrypted idcard result: ", encryptedIdcardInfo)
            recordPayload.realName = kyc.maskRealName(idcardInfo.name)
            recordPayload.realId = kyc.maskRealIdNumber(idcardInfo.idcard_number)
            recordPayload.uniqueHash = uniqueHash
            recordPayload.passedAt = new Date()
            recordPayload.data = encryptedIdcardInfo
          }
          rows[i].update(recordPayload);

          // SUCCESS, change user.kycState to 1
          if (result.result_code === 1000 || result.result_code === 1001) {
            let user = await model.User.findByPk(rows[i].userId);
            if (user) {
              user.update({ kycState: 1 })
            }
          }
        } catch (resultErr) {
          console.log("result error:", resultErr);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }, 1000);
};

module.exports = {
  run: run
};
