/* eslint-disable linebreak-style */
const express = require('express');
const { MongoClient } = require('mongodb');
const debug = require('debug')('app:adminRouter');

const adminRouter = express.Router();

const clothes = [
  {
    id: 0,
    name: 'man sale 0',
    price: '100 0 ',
    decriptione: 'This is men clothes 10',
  },
  {
    id: 1,
    name: 'man sale',
    price: '100',
    decriptione: 'This is men clothes 1',
  },
  {
    id: 2,
    name: 'man sale 2',
    price: '200',
    decriptione: 'This is men clothes 2',
  },
  {
    id: 3,
    name: 'man sale 3',
    price: '300',
    decriptione: 'This is men clothes 3',
  },
  {
    id: 4,
    name: 'man sale 4',
    price: '400',
    decriptione: 'This is men clothes 4',
  },
  {
    id: 5,
    name: 'man sale 5',
    price: '500',
    decriptione: 'This is men clothes 5',
  },
  {
    id: 6,
    name: 'man sale 6',
    price: '600',
    decriptione: 'This is men clothes 6',
  },
];

function router() {
  adminRouter.route('/')
    .get((req, res) => {
      const url = 'mongodb://localhost:27017/';
      const dbname = 'shop';
      (async function mongo() {
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('connect correctly to server');

          const db = client.db(dbname);

          const response = await db.collection('clothes').insertMany(clothes);
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
