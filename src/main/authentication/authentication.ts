import process from "process";
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const passport = require('passport');

const authenticationConfig = require('./authentication-config.json');

export default function(): void {

  var users = [];

  var findByOid = function(oid, fn) {
    for (var i = 0, len = users.length; i < len; i++) {
      var user = users[i];
      if (user.oid === oid) {
        return fn(null, user);
      }
    }
    return fn(null, null);
  };

  passport.serializeUser(function(user, done) {
    done(null, user.oid);
  });

  passport.deserializeUser(function(oid, done) {
    findByOid(oid, function (err, user) {
      done(err, user);
    });
  });

  passport.use(new OIDCStrategy({
      identityMetadata:  authenticationConfig.IDENTITY_METADATA,
      clientID: authenticationConfig.CLIENT_ID,
      responseType: authenticationConfig.RESPONSE_TYPE,
      responseMode: authenticationConfig.RESPONSE_MODE,
      policy: authenticationConfig.POLICY,
      redirectUrl: process.env.FRONTEND_URL + '/login/return',
      allowHttpForRedirectUrl: true,
      clientSecret: process.env.CLIENT_SECRET,
      isB2C: true,
    },
    function(iss, sub, profile, accessToken, refreshToken, done) {
      findByOid(profile.oid, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          // "Auto-registration"
          users.push(profile);
          return done(null, profile);
        }
        return done(null, user);
      });
    }
  ));

}
