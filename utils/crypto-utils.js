const crypto = require('crypto')
const config = require('../config.json')

function generateKeys(passphrase) {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: "pkcs1",
      format: "pem"
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: passphrase
    }
  });
  return { public: publicKey, private: privateKey };
}

const encryptRsa = function(toEncrypt, publicKey) {
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

const decryptRsa = function(toDecrypt, privateKey) {
  var buffer = Buffer.from(toDecrypt, "base64");
  var decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

const sha1HashHex = function(text) {
  let shasum = crypto.createHash('sha1');
  shasum.update(text);
  return shasum.digest('hex')
}

const genPasswordHash = function (pwd, salt) {
  return sha1HashHex(`${config.secret_salt}${pwd}${salt}`)
}

module.exports = {
  generateKeys,
  encryptRsa,
  decryptRsa,
  sha1HashHex,
  genPasswordHash
}