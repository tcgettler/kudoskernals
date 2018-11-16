const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport, user){
  let User = user;
  passport.serializeUser(function (user, done) {
    console.log("serialize")
    done(null, user.id);
  });


  passport.deserializeUser(function(id, done) {
    User.findById(id).then(function(user) {
      if(user){
        done(null, user);
      }
      else{
        done(user.errors,null);
      }
    });

}); 
  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(
    
    {
    passReqToCallback : true // allows us to pass back the entire request to the callback
    },
  
    function(req, username, password, done) {
  
     
  
      User.findOne({ username: username }).then(function (user) {
        user.comparePassword(password, function (error, response) {
          if (error) {
            return done(null, error)
          }
      });
  
        console.log("On to the next one");
        return done(null,user);
  
      }).catch(function(err){
  
        console.log("Error:",err);
  
        return done(null, false, { message: 'Something went wrong with your Signin' });
  
  
      });
  
    }
    ));
};