const passport = require("koa-passport");
const jwt = require('jsonwebtoken');
const model = require("../model");
const kyc = require("../utils/kyc");

module.exports = {
  authWeibo: async function(ctx) {
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

  authWeiboDone: async function(ctx) {
    let user = ctx.state.user.get({ plain: true });
    const token = jwt.sign(user, 'jwt_secret_1234');
    user.access_token = token;
    ctx.body = { status: 'success', data: user };
  },

  kycFaceIdStart: async function(ctx) {
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

  kycFaceIdCallback: async function(ctx) {
    console.log("kycFaceIdCallback:", ctx);
  },

  kycFaceIdNotifyCallback: async function(ctx) {
    console.log("kycFaceIdNotifyCallback:", ctx);
  }
};
