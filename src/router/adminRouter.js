/* eslint-disable linebreak-style */
const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRouter');

const adminRouter = express.Router();

const fs = require('fs');

function router(uri) {
  adminRouter.use((req, res, next) => {
    if (req.user.username === '1' && req.user.password === '1') {
      next();
    } else {
      res.redirect('/');
    }
  });
  adminRouter.route('/')
    .get((req, res) => {
      // const url = 'mongodb://localhost:27017/';
      // const dbname = 'shop';
      // (async function mongo() {
      //   let client;
      //   try {
      //     client = await MongoClient.connect(url);
      //     debug('connect correctly to server');

      //     const db = client.db(dbname);

      //     //const response = await db.collection('clothes').insertMany(clothes);
      //     res.json(response);
      //   } catch (err) {
      //     debug(err.stack);
      //   }
      //   client.close();
      // }());
      res.render('admin', {
        Title: 'Admin page',
      });
    })
    .post((req, res) => {
      const {
        masanpham, maloai, tensanpham, gioitinh, dongia, hinh, mota,
      } = req.body;
      const product = {
        masanpham, maloai, tensanpham, gioitinh, dongia, hinh, mota,
      };
      const dbname = 'shop';
      (async function addUser() {
        let client;
        try {
          client = await MongoClient.connect(uri);
          debug('conected correctly to server');

          const db = client.db(dbname);

          const col = db.collection('product');
          const results = await col.insertOne(product);
          debug(results);
          req.login(results.ops[0], () => {
            res.send(req.body);
          });
        } catch (err) {
          debug(err);
        }
        client.close();
      }());
    });


  adminRouter.route('/product')
    .get((req, res) => {
      const dbname = 'shop';
      const rawdata = fs.readFileSync('sanpham.json');
      const product = JSON.parse(rawdata);
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri);
          debug('connect correctly to server');

          const db = client.db(dbname);

          const response = await db.collection('product').insertMany(product);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  adminRouter.route('/species')
    .get((req, res) => {
      const dbname = 'shop';
      const rawdata = fs.readFileSync('loai.json');
      const species = JSON.parse(rawdata);
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(uri);
          debug('connect correctly to server');

          const db = client.db(dbname);

          const response = await db.collection('species').insertMany(species);
          res.json(response);
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return adminRouter;
}

module.exports = router;
