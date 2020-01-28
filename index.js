const cluster = require("cluster");
const cron = require("node-cron");
const cryptoUtils = require("./utils/crypto-utils");
const fs = require("fs");

const workerMapping = {
  kyc: require("./workers/kyc"),
  httpd: require("./workers/httpd")
};

let workers = [];

const getWorkerByName = function(name) {
  for (let i = 0; i < workers.length; i++) {
    const worker = workers[i];
    if (worker.name === name) {
      return worker;
    }
  }
  return null;
};

const handleIPCMessage = function(from, msg) {
  console.log("master get a message from", from.name);
  if (msg.recipient) {
    if (msg.recipient === "master") {
      console.log("master get the message", msg);
    } else {
      // forward to recipient worker
      let recipientW = getWorkerByName(msg.recipient);
      if (recipientW) {
        recipientW.worker.send(msg);
      } else {
        console.log(`Unknown worker named "${msg.recipient}"`);
      }
    }
  } else {
    // boradcast
    for (let i = 0; i < workers.length; i++) {
      const w = workers[i];
      w.worker.send(msg);
    }
  }
};

const serve = function() {
  if (cluster.isMaster) {
    const workerNames = ["httpd", "kyc"];
    for (let i = 0; i < workerNames.length; i++) {
      let worker = cluster.fork();
      console.log(`Start worker #${worker.id}`);
      workers.push({
        id: worker.id,
        name: workerNames[i],
        worker: worker
      });
    }
    // handle IPC
    workers.forEach(w => {
      w.worker.on("message", msg => {
        handleIPCMessage(w, msg);
      });
      w.worker.on("exit", (deadWorker, code, signal) => {
        var worker = cluster.fork();

        var newPID = worker.process.pid;
        var oldPID = deadWorker.process.pid;

        // Log the event
        console.log(`worker ${oldPID} died. code=${code}, signal=${signal}`);
        console.log(`worker ${newPID} born.`);
      });
    });

    workers[0].worker.send({
      action: "assign",
      params: { task: "httpd" }
    });

    workers[1].worker.send({
      action: "assign",
      params: { task: "kyc" }
    });

    cron.schedule("*/1 * * * *", () => {
      // check kyc result per 1 minutes
      workers[1].worker.send({
        action: "assign",
        params: { task: "kyc" }
      });
    });
  } else if (cluster.isWorker) {
    let proc = null;
    process.on("message", function(msg) {
      if (msg.action && msg.action === "assign") {
        proc = workerMapping[msg.params.task];
        if (proc !== null) {
          proc.run(cluster.worker);
        } else {
          console.log("No such a task", msg.params);
        }
      } else {
        for (const name in workerMapping) {
          if (workerMapping.hasOwnProperty(name)) {
            workerMapping[name].crackMessage(msg);
          }
        }
      }
    });
  }
};

const decryptKyc = async function (username) {
  const model = require('./model')
  const kycUtils = require('./utils/kyc')
  const user = await model.User.findOne({
    where: { username: username },
    attributes: model.UserAttrs
  });
  if (user === null) {
    console.log('no user')
    return
  }
  console.log('user:', user.get({plain: true}))
  const latestKycRecord = await model.Kyc.findOne({
    where: { resultMessage: 'SUCCESS', userId: user.id },
    attributes: ["resultCode", "resultMessage", "data", "errorMessage", "realName", "realId", "uniqueHash", "passedAt"],
    order: [["createdAt", "DESC"]]
  });
  if (latestKycRecord === null) {
    console.log('no kyc record')
    return
  }
  console.log('kyc record:', latestKycRecord.get({plain: true}))
  const result = kycUtils.decryptKycResult(latestKycRecord.data);
  console.log('result:', result)
}

function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log(`
Call for health API service

Usage:

\tnode index.js <command>

The commands are:

\tgen-keys\tgenerate 2048-bits rsa keys
\tserve   \tstart service
    `)
  } else  {
    if (args[0] === 'gen-keys' || args[0] === 'gen') {
      genKeys();
      genKeys('kyc-')
      console.log('gen keys success, look at keys dir')
    } else if (args[0] === 'decrypt-kyc') {
      if (args[1]) {
        decryptKyc(args[1])
      }
    } else if (args[0] === 'serve') {
      serve();
    }
  }
}

const genKeys = (keyPrefix) => {
  const dir = './keys';
  const keys = cryptoUtils.generateKeys("")
  if (fs.existsSync(dir)) {
    console.log(`${dir} directory found`);
  } else {
    console.log(`no ${dir} directory`);
    fs.mkdirSync(dir)
  }
  fs.writeFileSync(`${dir}/${keyPrefix || ''}pub.key`, keys.public);
  fs.writeFileSync(`${dir}/${keyPrefix || ''}priv.key`, keys.private);
}

main()