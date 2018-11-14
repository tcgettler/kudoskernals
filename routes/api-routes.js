const bcrypt = require('bcrypt');
const passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
const db = require('../models/Index');

module.exports = function (app) {
    app.post('/api/newUser', function (req, res) {
        let hash = bcrypt.hashSync(req.body.password, 10);
        db.User.create({
          username: req.body.name,
          password: hash,
        }).then(function (response) {
          res.json(response);
        });
    });

    app.post('/login',
        passport.authenticate('local-signin'),
        function (req, res) {
        res.json({
            user: req.user,
            success: true
        });
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
        return next();
        res.redirect('/signin');
    }

    app.get('/login', isLoggedIn, function(req, res){
        res.json(req.user);
    })
}