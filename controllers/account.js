const passport = require("koa-passport");
const jwt = require('jsonwebtoken');
const cryptoUtils = require("../utils/crypto-utils");
const model = require("../model");
const kyc = require("../utils/kyc");
const uuid = require("uuid");

module.exports = {
  register: async function (ctx) {
    let registerData = ctx.request.body;
    const username = registerData.username
    let existed = await model.User.findOne({
      where: { username: username },
      attributes: model.UserAttrs
    });
    if (existed) {
      ctx.body = { status: 400, data: 'already existed' };
      return
    }
    const salt = uuid.v4()
    await model.User.create({
      name: username,
      username: username,
      password: cryptoUtils.genPasswordHash(registerData.password, salt),
      salt: salt
    });
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        user = user.get({ plain: true });
        delete user.password
        delete user.salt

        const token = jwt.sign(user, 'jwt_secret_1234');
        user.access_token = token;
        ctx.body = { status: 'success', data: user };
      } else {
        ctx.status = 400;
        ctx.body = { status: 400, data: 'incorrect form data' };
      }
    })(ctx);
  },

  login: async function (ctx) {
    return passport.authenticate('local', (err, user, info, status) => {
      if (user) {
        ctx.login(user);
        user = user.get({ plain: true });
        delete user.password
        delete user.salt

        const token = jwt.sign(user, 'jwt_secret_1234');
        user.access_token = token;
        ctx.body = { status: 'success', data: user };
      } else {
        ctx.status = 400;
        ctx.body = { status: 404, error: 'incorrect username or password' };
      }
    })(ctx);
  },

  me: async function (ctx) {
    const user = ctx.state.user
    let existed = await model.User.findOne({
      where: { id: user.id },
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
  },

  authWeibo: async function (ctx) {
    await passport.authenticate("weibo")(ctx);
  },

  authWeiboCallback: async function(ctx) {
    await passport.authenticate(
      "weibo",
      { failureRedirect: "/" },
      function(req, res) {
        ctx.login(res);
        ctx.redirect("/auth/weibo/done")
      }
    )(ctx);
  },

  authWeiboDone: async function (ctx) {
    let user = ctx.state.user.get({ plain: true });
    const token = jwt.sign(user, 'jwt_secret_1234');
    user.access_token = token;
    ctx.body = { status: 'success', data: user };
  },

  kycFaceIdStart: async function (ctx) {
    let user = ctx.state.user;
    try {
      const resp = await kyc.faceIdGetBizToken();
      const bizToken = resp.data.biz_token;
      const now = Date.now();
      await model.Kyc.create({
        userId: user.id,
        state: 0,
        bizToken: bizToken,
        expiredAt: new Date(now + 300 * 1000)
      });
      ctx.body = {
        status: 'success',
        data: {
          url: `https://openapi.faceid.com/lite/v1/do/${resp.data.biz_token}`
        }
      }
    } catch (e) {
      if (e.response && e.response.data) {
        console.log("error", e.response.data);
      } else {
        console.log("error", e);
      }
      ctx.body = {
        status: 500,
        error: e.toString()
      }
    }
  },

  kycFaceIdCallback: async function (ctx) {
    console.log("kycFaceIdCallback:", ctx);
    ctx.body = "实名认证已提交。请回到网站，查看认证状态。"
  },

  kycFaceIdNotifyCallback: async function (ctx) {
    console.log("kycFaceIdNotifyCallback:", ctx);
  }
};
