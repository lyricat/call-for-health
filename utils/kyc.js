const crypto = require("crypto");
const cryptoUtils = require("./crypto-utils");
const axios = require("axios");
const fs = require("fs");
const Sequelize = require("sequelize");
const model = require("../model");
const conf = require("../config.json");


const kycGenSign = function() {
  const validDuration = 300; // 300秒
  const currentTime = Math.floor(Date.now() / 1000);
  const expireTime = currentTime + validDuration;
  const random = Math.floor(Math.random() * 10000000000); // 自行产生的一个10位无符号随机数
  const raw = `a=${conf.faceid.api_key}&b=${expireTime}&c=${currentTime}&d=${random}`;
  const signBuffer = crypto
    .createHmac("sha1", conf.faceid.api_secret)
    .update(raw)
    .digest();
  const signFull = Buffer.concat([signBuffer, Buffer.from(raw)]).toString(
    "base64"
  );
  // console.log("raw: ", raw);
  // console.log("sign: ", signBuffer);
  // console.log("signFull: ", signFull);
  return signFull;
};

const kycFaceIdGetResult = async function(bizToken) {
  const opts = {
    method: "GET",
    url: "https://openapi.faceid.com/lite/v1/get_result",
    data: {
      sign: kycGenSign(),
      sign_version: "hmac_sha1",
      biz_token: bizToken,
      verbose: 1
    }
  };
  return await axios(opts);
};

const kycFaceIdGetBizToken = async function() {
  const opts = {
    method: "POST",
    url: "https://openapi.faceid.com/lite/v1/get_biz_token",
    data: {
      sign: kycGenSign(),
      sign_version: "hmac_sha1",
      return_url: conf.faceid.return_url,
      notify_url: conf.faceid.notify_url,
      biz_no: "",
      comparison_type: 1,
      group: 1,
      liveness_type: "video_number",
      security_level: 3,
      liveness_preferences: 2,
      liveness_retry_count: 3
    }
  };
  return await axios(opts);
};

const kycGetPendingRecords = async function() {
  let rows = await model.Kyc.findAll({
    where: {
      resultCode: {
        [Sequelize.Op.not]: 1000,
        [Sequelize.Op.not]: 1001
      },
      expiredAt: {
        [Sequelize.Op.gt]: new Date().toISOString()
      },
    },
    order: [["createdAt", "DESC"]],
    limit: 100
  });
  let uniqueMap = {}
  for (let i = 0; i < rows.length; i++) {
    if (!uniqueMap.hasOwnProperty(rows[i].userId)) {
      uniqueMap[rows[i].userId] = rows[i]
    }
  }
  return Object.values(uniqueMap);
};

const encryptKycResult = function(info) {
  let data = `${info.name}|${info.idcard_number}|${info.address}`
  if (Buffer.byteLength(data, 'utf8') > 255) {
    data = `${info.name}|${info.idcard_number}`
  }
  let publicKey = fs.readFileSync(conf.kyc_public_key_file, "utf8");
  return cryptoUtils.encryptRsa(data, publicKey)
};

const decryptKycResult = function(text) {
  let privateKey = fs.readFileSync(conf.kyc_private_key_file, "utf8");
  return cryptoUtils.decryptRsa(text, privateKey)
};

const maskRealName = function (name) {
  const firstLetter = name.slice(0, 1)
  return firstLetter + name.slice(1).replace(/./g, "*")
}

const maskRealIdNumber = function (number) {
  const tailDigits = number.slice(14)
  return number.slice(0, 14).replace(/./g, "*") + tailDigits
}

module.exports = {
  faceIdgenSign: kycGenSign,
  faceIdGetResult: kycFaceIdGetResult,
  faceIdGetBizToken: kycFaceIdGetBizToken,
  faceIdGetPendingRecords: kycGetPendingRecords,
  encryptKycResult,
  decryptKycResult,
  maskRealName,
  maskRealIdNumber
};
