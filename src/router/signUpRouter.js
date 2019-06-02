/* eslint-disable linebreak-style */
const express = require('express');

const signUpRouter = express.Router();

function router() {
  signUpRouter.route('/')
    .all((req, res, next) => {
      if (req.user) {
        req.logout();
        res.redirect('/signUp');
      } else {
        next();
      }
    })
    .get((req, res) => {
      res.render('signUp');
    });


  return signUpRouter;
}

module.exports = router;
