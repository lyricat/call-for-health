const cluster = require("cluster");
const cron = require("node-cron");
const cryptoUtils = require("./utils/crypto-utils");

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
      const keys = cryptoUtils.generateKeys("")
      console.log(`
Public Key:
${keys.public}

Private Key:
${keys.private}
      `)
    } else if (args[0] === 'serve') {
      serve();
    }
  }
}

main()