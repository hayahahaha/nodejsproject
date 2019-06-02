/* eslint-disable linebreak-style */
const express = require('express');

const registerRouter = express.Router();

function router() {
  registerRouter.route('/')
    .get((req, res) => {
      res.render('register');
    });
  return registerRouter;
}

module.exports = router;
