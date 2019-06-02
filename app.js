/* eslint-disable linebreak-style */
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const store = new MongoDBStore({
  uri: 'mongodb+srv://sa:sa@cluster0-bg155.mongodb.net/test?retryWrites=true&w=majority',
  databaseName: 'shop',
  collection: 'sessions',
});

const app = express();
const port = process.env.PORT || 3000;
const uri = 'mongodb+srv://sa:sa@cluster0-bg155.mongodb.net/test?retryWrites=true&w=majority';

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'product',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: { maxAge: 180 * 60 * 1000 },
}));

require('./src/config/passport.js')(app);

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

const productRouter = require('./src/router/productRouter')(uri);
const adminRouters = require('./src/router/adminRouter')(uri);
const signUpRouter = require('./src/router/signUpRouter')();
const authRouter = require('./src/router/authRoutes')(uri);
const cartRouter = require('./src/router/cartRouter')(uri);
const indexRouter = require('./src/router/indexRouter')(uri);

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/admin', adminRouters);
app.use('/signup', signUpRouter);
app.use('/auth', authRouter);
app.use('/cart', cartRouter);

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));

app.use((req, res, next) => {
  res.locals.loin = req.isAuthenticated;
  res.locals.session = req.session;
  next();
});


app.listen(port, () => {
  debug(`listening on port ${chalk.green(port)}`);
});
