/* eslint-disable linebreak-style */
const express = require('express');
const debug = require('debug')('app:cartRouter');
const { MongoClient, ObjectId } = require('mongodb');
const Cart = require('../../model/cart');

const cartRouter = express.Router();

function router(uri) {
  cartRouter.route('/')
    .all((req, res, next) => {
      if (req.user) {
        next();
      } else {
        // next();
        res.redirect('/auth/signin');
      }
    })
    .get((req, res) => {
      const cart = new Cart(req.session.cart ? req.session.cart : {});
      const products = cart.getItems();
      // res.send(products);
      // console.log(products);
      res.render('shoppingCart', {
        tittle: 'Giỏ Hàng',
        products,
        totalPrice: cart.totalPrice,
      });
    });

  cartRouter.route('/add/:id')
    .get((req, res) => {
      // const productId = req.params.id;
      const { id } = req.params;
      const dbname = 'shop';
      let product;
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri, { useNewUrlParser: true });
          debug('connect correctly to server');

          const db = client.db(dbname);

          const col = await db.collection('product');
          product = await col.findOne({ _id: new ObjectId(id) });
          client.close();
          const cart = new Cart(req.session.cart ? req.session.cart : {});
          cart.add(product, id);
          req.session.cart = cart;
          req.session.save();
          const link = cart.items[id].item.gioitinh;
          res.redirect(`/product/${link}/${id}`);
        } catch (err) {
          debug(err.stack);
        }
      }());
    });

  cartRouter.route('/remove/:id')
    .get((req, res) => {
      const { id } = req.params;
      const cart = new Cart(req.session.cart);
      cart.remove(id);
      req.session.cart = cart;
      res.redirect('/cart');
    });

  cartRouter.route('/checkout')
    .get((req, res) => {
      res.render('checkout');
    })
    .post((req, res) => {
      const {
        name, telephoneNumber, address, province, district, conmmune,
      } = req.body;
      const cart = new Cart(req.session.cart);
      const infoCustomer = {
        name,
        telephoneNumber,
        address,
        province,
        district,
        conmmune,
        cart,
      };
      const dbname = 'shop';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(uri);
          debug('conected correctly to server');

          const db = client.db(dbname);

          const col = db.collection('customer');
          const results = await col.insertOne(infoCustomer);
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

  return cartRouter;
}

module.exports = router;
