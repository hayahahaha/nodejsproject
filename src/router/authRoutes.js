/* eslint-disable linebreak-style */
const express = require('express');
const debug = require('debug')('app:authRoutes');
const passport = require('passport');
const { MongoClient } = require('mongodb');

const authRouter = express.Router();

function router(uri) {
  authRouter.route('/signUp')
    .post((req, res) => {
      const { username, password } = req.body;
      const dbname = 'shop';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(uri, { useNewUrlParser: true });
          debug('conected correctly to server');

          const db = client.db(dbname);

          const col = db.collection('user');
          const user = { username, password };
          const results = await col.insertOne(user);
          debug(results);
          req.login(results.ops[0], () => {
            res.redirect('/');
          });
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });

  authRouter.route('/signin')
    .all((req, res, next) => {
      if (req.user) {
        if (req.user.username === '1' && req.user.password === '1') {
          res.redirect('/admin');
        }
        res.redirect('/auth/profile');
      } else {
        next();
      }
    })
    .get((req, res) => {
      res.render('signin');
    })
    .post(passport.authenticate('local', {
      successRedirect: '/cart',
      failureRedirect: '/auth/signIn',
    }));

  authRouter.route('/profile')
    .get((req, res) => {
      res.json(req.user);
    });
  return authRouter;
}
module.exports = router;
