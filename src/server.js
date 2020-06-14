const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session');
const { Router } = require('express');
const MongoStore = require('connect-mongo')(session);
const { db } = require('./models/user');

const shortURlsRoute = require("./routes/shortUrls");
const userRoute = require("./routes/user");

const app = express()

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db,
  })
}));

mongoose.connect('mongodb://localhost/urlShort', {
  useNewUrlParser: true, useUnifiedTopology: true
})


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// app.use("", shortURlsRoute);
app.use("", userRoute, shortURlsRoute);

app.listen(process.env.PORT || 5000, () => console.log(`url-shoretner started on port ${process.env.port || 5000}!`));
