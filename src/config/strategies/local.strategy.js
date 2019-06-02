/* eslint-disable linebreak-style */
const passport = require('passport');
const { Strategy } = require('passport-local');
const { MongoClient } = require('mongodb');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    }, (username, password, done) => {
      const uri = 'mongodb+srv://sa:sa@cluster0-bg155.mongodb.net/test?retryWrites=true&w=majority';
      const dbname = 'shop';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(uri);
          const db = client.db(dbname);

          const col = db.collection('user');
          const user = await col.findOne({ username });
          if (user !== null) {
            if (user.password === password) {
              done(null, user);
            }
          } else {
            done(null, false);
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.log(err);
        }
        client.close();
      }());
    },
  ));
};
