const bcrypt = require('bcrypt');
const passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
const db = require('../models/Index.js');

module.exports = function (app) {
    /*********************************************Signin API Calls **********************************************/
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
    /*********************************************************End of signin api calls **************************************************/
    /*******************************************************Finding notes calls *****************************************************/
    app.get('/api/getNotes', function(req, res){
        db.Notes.find({})
        .populate({path: 'sender', model: 'User'})
        .populate({path: 'recipient', model: 'User'}).sort({_id: -1})
        .then(function(data){
            res.json(data);
        })
    });

    app.get('/api/getNotes/:id', function(req, res){
        db.User.findById({_id: req.params.id})
        .populate({path: 'notes', model: 'Notes', populate:{path:'sender', model: 'User'}})
        .populate({path: 'notes', model: 'Notes', populate:{path:'recipient', model: 'User'}})
        .then(function(data){
            res.json(data);
        });
    });

    app.get('/api/getReceived/:id', function(req, res){
        db.Notes.find({recipient: req.params.id})
        .populate({path: 'sender', model: 'User'})
        .populate({path: 'recipient', model: 'User'})
        .then(function(data){
            res.json(data);
        })
    });
    /*******************************************************End of finding note calls ***********************************/
    // Used to populate options form
    app.get('/api/getUsers', function(req, res){
        db.User.find({}).then(function(data){
            res.json(data);
        })
    });

    //Used to post new note
    app.post('/api/newNote', function(req,res){
        db.Notes.create(req.body).then(function(response){
            db.User.findByIdAndUpdate({_id: response.sender}, {$push: {notes:response._id}}).then(function(data){
                res.json({success: "success"})
            }).catch(function(err){
                res.json(err);
            });
        });
    })
}