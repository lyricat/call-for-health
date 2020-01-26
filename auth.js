const passport = require("koa-passport");
const passportJWT = require("passport-jwt");
const User = require("./model/user");
const conf = require("./config");
const cryptoUtils = require("./utils/crypto-utils");

const WeiboStrategy = require("passport-weibo").Strategy;
const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy   = passportJWT.Strategy;

passport.use(
  new WeiboStrategy(
    {
      clientID: conf.weibo.client_id,
      clientSecret: conf.weibo.client_secret,
      callbackURL: conf.weibo.callback_url
    },
    async function(accessToken, refreshToken, profile, done) {
      var usr = {};
      let existed = await User.findOne({
        where: { weiboId: profile.id }
      });
      if (existed) {
        await User.update(
          { name: profile.displayName },
          { where: { id: existed.id } }
        );
        existed = existed.get({ plain: true });
        existed.name = profile.displayName;
        done(null, existed);
      } else {
        try {
          usr = await User.create({
            name: profile.displayName,
            weiboId: profile.id
          });
          usr = usr.get({ plain: true });
          done(null, usr);
        } catch (err) {
          console.error("register or create error.", err);
          done(null, null);
        }
      }
    }
  )
);

passport.use(new LocalStrategy({}, async (username, password, done) => {
  const user = await User.findOne({ where: { username: username } })
  if (user) {
    const hash = cryptoUtils.genPasswordHash(password, user.salt)
    if (user.password === hash) {
      return done(null, user);
    }
  }
  return done(null, null);
}));


passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey   : 'jwt_secret_1234'
  },
  function (jwtPayload, done) {
    return User.findByPk(jwtPayload.id)
      .then(user => {
        return done(null, user);
      })
      .catch(err => {
        return done(null, null);
      });
  }
));

passport.serializeUser(function(user, done) {
  console.log("serializeUser.");
  done(null, user);
});

passport.deserializeUser(async function(user, done) {
  console.log("deserializeUser");
  if (user.id) {
    user = await User.findByPk(user.id);
  }
  done(null, user);
});
