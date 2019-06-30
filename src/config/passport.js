/* eslint-disable linebreak-style */
const passport = require('passport');
require('./strategies/local.strategy')();

module.exports = function passportconfig(app) {
  app.use(passport.initialize());
  app.use(passport.session());
  // store use in session
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  // Retrieves user from session
  passport.deserializeUser((user, done) => {
    // find user by id
    done(null, user);
  });
};
