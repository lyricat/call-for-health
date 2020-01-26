const Koa = require("koa");
const cors = require('@koa/cors');
const bodyParser = require("koa-bodyparser");
const session = require("koa-session");
const passport = require("koa-passport");
const db = require("../db");
const route = require("../route");
const conf = require("../config.json");

const run = function(worker) {
  const app = new Koa();
  app.use(cors());

  // body parser
  app.use(bodyParser());

  // Sessions
  app.keys = ["session_secret_1234"];
  app.use(session({}, app));

  require("../auth");
  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // logger
  app.use(async function(ctx, next) {
    const start = new Date();
    await next();
    const ms = new Date() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });

  // route
  route.init(app);

  // db
  db.testDb();

  // serve
  app.listen(conf.port);
};

module.exports = {
  run: run
};
