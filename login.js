const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User=require('./user');
const passport=require('passport');
var flag=0;


const login = express.Router();

login.use(bodyParser.urlencoded({
  extended: true
}));





login.post("/register", function(req, res){

  User.register({username: req.body.username}, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local",{ failureRedirect: '/register' })(req, res, function(){
        res.redirect("/secrets");
      });
    }
  });

});

login.post("/login", function(req, res){

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err){
      flag=1;
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local",{ failureRedirect: '/login' })(req, res, function(){
        res.redirect("/secrets");
          flag=0;
      });
    }
  });

});


login.get("/", function(req, res){
  res.render("home");
});

login.get("/auth/google",
  passport.authenticate('google', { scope: ["profile","email"] })
);

login.get('/auth/facebook',
  passport.authenticate('facebook',{ scope : ["email"] }));

login.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    console.log(req.user);
   
    res.redirect("/secrets");
  });

login.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
     console.log(req.user.name);
    // Successful authentication, redirect home.
    res.redirect('/secrets');
  });

login.get("/login", function(req, res){
  res.render("login",{f : flag});
    flag=0;
});

login.get("/register", function(req, res){
  res.render("register");
});

login.get("/secrets", function(req, res){
    console.log(req.user);
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err){
      console.log(err);
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers});
      }
    }
  });
});





login.get("/logout", function(req, res){
  req.logout();
  res.redirect("/");
});



module.exports=login;
