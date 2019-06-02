/* eslint-disable linebreak-style */
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:adminRouter');


const productRouter = express.Router();

const router = (uri) => {
  productRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      next();
      // res.redirect('/auth/signin');
    }
  });
  productRouter.route('/')
    .get((req, res) => {
      const dbname = 'shop';
      const pageCurrent = (req.query.pagenumber || 1);
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri, { useNewUrlParser: true });
          debug('connect correctly to server');
          const db = client.db(dbname);

          const col = await db.collection('product');
          const numberCol = await col.find().count();
          const totalPage = Math.ceil(numberCol / 15);
          const products = await col.find()
            .skip(pageCurrent * 15 - 15)
            .limit(15)
            .toArray();

          res.render(
            'product',
            {
              Title: 'Sản phẩm',
              clo: products,
              totalPage,
              pageCurrent,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  productRouter.route('/:sex')
    .get((req, res) => {
      const { sex } = req.params;
      const dbname = 'shop';
      const pageCurrent = (req.query.pagenumber || 1);
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri, { useNewUrlParser: true });
          debug('connect correctly to server');
          const db = client.db(dbname);

          const col = await db.collection('product');

          const numberCol = await col.find({ gioitinh: sex }).count();
          const totalPage = Math.ceil(numberCol / 15);
          const products = await col.find({ gioitinh: sex })
            .skip(pageCurrent * 15 - 15)
            .limit(15)
            .toArray();

          res.render(
            'product',
            {
              Title: `Sản phẩm ${sex}`,
              clo: products,
              totalPage,
              pageCurrent,
            },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });


  productRouter.route('/:sex/:id')
    .get((req, res) => {
      const { id } = req.params;
      const dbname = 'shop';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri, { useNewUrlParser: true });
          debug('connect correctly to server');

          const db = client.db(dbname);

          const col = await db.collection('product');
          const product = await col.findOne({ _id: new ObjectId(id) });
          debug('product');
          res.render('singleitem',
            { Title: product.tensanpham, clo: product });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return productRouter;
};

module.exports = router;
