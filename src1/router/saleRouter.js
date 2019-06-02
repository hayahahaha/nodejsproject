/* eslint-disable linebreak-style */
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const debug = require('debug')('app:adminRouter');

const saleRouter = express.Router();

const router = (nav) => {
  saleRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017/';
      const dbname = 'shop';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connect correctly to server');

          const db = client.db(dbname);

          const col = await db.collection('clothes');
          const clothes = await col.find().toArray();
          res.render(
            'sale',
            { Title: 'sale', nav, clo: clothes },
          );
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });


  saleRouter.route('/:id')
    .get((req, res) => {
      const { id } = req.params;
      const url = 'mongodb://localhost:27017/';
      const dbname = 'shop';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connect correctly to server');

          const db = client.db(dbname);

          const col = await db.collection('clothes');
          const clothes = await col.findOne({ _id: new ObjectId(id) });
          debug('clothes');
          res.render('singleitem',
            { Title: 'singleSale', nav, clo: clothes });
        } catch (err) {
          debug(err.stack);
        }
        client.close();
      }());
    });

  return saleRouter;
};

module.exports = router;
