const axios = require("axios");
const crypto = require("crypto");
const fs = require("fs");
const config = require("./config.json");

function signData(json) {
  const unsigned = json.pid + json.user + json.text;
  const signer = crypto.createSign("SHA256");
  const privateKey = fs.readFileSync(config.private_key_file, "utf-8");
  signer.update(unsigned);
  signer.end();
  return signer.sign({
    key: privateKey,
    passphrase: ""
  }, "base64");
}

function verifyData(json, signature) {
  const unsigned = json.pid + json.user + json.text;
  const verify = crypto.createVerify("SHA256");
  const publicKey = fs.readFileSync(config.public_key_file, "utf-8");
  verify.update(unsigned);
  verify.end();
  return verify.verify(publicKey, signature, "base64");
}

function formData(data) {
  let payload = {
    pid: config.provider.id,
    data: data
  };
  payload.sign = signData(payload);
  const buff = new Buffer(JSON.stringify(payload));
  return buff.toString("base64");
}

function parseData(data) {
  let json = null;
  try {
    const decodedData = Buffer.from(data, "base64").toString("utf8");
    json = JSON.parse(decodedData);
    if (!json.hasOwnProperty("pid") || json.pid !== config.provider.id) {
      return null;
    }
    if (!json.hasOwnProperty("data")) {
      console.log("err: incorrect data format");
      return null;
    }

    if (!json.hasOwnProperty("sign") || !verifyData(json, json.sign)) {
      console.log("err: incorrect signature");
      return null;
    }
    return json;
  } catch (err) {
    console.log("err:", err);
    return null;
  }
}

function test() {
  const data = formData("abc")
  console.log("data:", data);
  const parsed = parseData(data);
  console.log("sign:", parsed.sign);
  console.log("verify result:", verifyData(parsed, parsed.sign));
}

module.exports = {
  seal: async function seal(data) {
    const payload = {
      data: formData(data),
      type: 1
    };
    const opts = {
      method: "POST",
      baseURL: config.network_gateway.host,
      url: "/message",
      data: payload,
      headers: {
        Authorization: "Bearer " + config.network_gateway.access_token
      }
    };
    const resp = await axios(opts);
    return resp.data;
  },
  single: async function(_opts) {
    const opts = {
      method: "GET",
      baseURL: config.network_gateway.host,
      url: "/message",
      params: { transaction_hash: _opts.txId }
    };
    const resp = await axios(opts);
    let item = resp.data.data;
    item.parsedData = parseData(item.data);
    return item;
  },
  list: async function list() {
    const opts = {
      method: "GET",
      baseURL: config.network_gateway.host,
      url: "/messages",
      params: { limit: 100 },
      headers: {
        Authorization: "Bearer " + config.network_gateway.access_token
      }
    };
    let resp = null
    try {
      resp = await axios(opts);
    } catch (err) {
      console.log(err)
      return []
    }
    const respItems = resp.data.data;
    const items = [];
    for (let ix = 0; ix < respItems.length; ix++) {
      let ele = respItems[ix];
      const parsedData = parseData(ele.data);
      if (parsedData !== null) {
        ele.parsedData = parsedData;
        items.push(ele);
      }
    }
    return items;
  }
};
