const express = require('express');
const passport = require("passport");
const session  = require('express-session')
const mongoose = require('mongoose');
const path = require('path');
const db = require('./models/Index.js');

const PORT = process.env.PORT || 3000;
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

mongoose.connect('mongodb://localhost/kudoskernals', { useNewUrlParser: true });

require('./routes/api-routes')(app);
require('./routes/html-routes')(app);
require("./config/passport.js")(passport, db.User);

app.listen(PORT, function() {
  console.log(`App running on port ${PORT}`);
});