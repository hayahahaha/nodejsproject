/* eslint-disable linebreak-style */
const express = require('express');
const Cart = require('../../model/cart');

const indexRouter = express.Router();

function router() {
  indexRouter.get('/', (req, res) => {
    const cart = new Cart(req.session.cart || {});
    const cartLength = cart.getItems.length;
    res.render('index', { Title: 'Trang chủ', cartLength });
  });
  return indexRouter;
}

module.exports = router;
