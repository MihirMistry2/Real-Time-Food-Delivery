require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('express-flash');

const mongoose = require('mongoose');
const MongoDBStore = require('connect-mongo')(session);

const path = require('path');

const passport = require('passport');
const passportInit = require('./app/config/passport');

const Emitter = require('events');

const bodyParser = require('body-parser');

const app = express();

// Database Connection using mongoose
const databseURL = 'mongodb://localhost/foodDB';
const connection = mongoose.connection;

mongoose.connect(databseURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
});

connection
    .once('open', () => {
        console.log('Database Connected');
    })
    .catch((err) => {
        console.log('Database Connections Failed ' + err);
    });

// session store in mongoDB collection (sessions)
const sessionStore = new MongoDBStore({
    mongooseConnection: connection,
    collection: 'sessions',
});

// event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);

// session save
app.use(
    session({
        secret: process.env.COOKIE_KEY,
        resave: false,
        store: sessionStore,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 },
    })
);

// passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
});

app.use(flash());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

// allow client side request for public file
app.use(express.static(path.join(__dirname, 'public')));

// routes
require('./routes/web.route')(app);

// set ejs for dynamic page
app.set('view engine', 'ejs');
app.set('views');

module.exports = app;
