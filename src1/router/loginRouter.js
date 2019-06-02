/* eslint-disable linebreak-style */
const express = require('express');

const loginRouter = express.Router();

function router() {
  loginRouter.route('/')
    .get((req, res) => {
      res.render('login');
    });
  return loginRouter;
}

module.exports = router;
