const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User=require('./user');


const router = express.Router();

router.use(bodyParser.urlencoded({
  extended: true
}));




router.get("/", function(req, res){
 
   
    res.render("submit");
 
});

router.post("/", function(req, res){
  const submittedSecret = req.body.secret;

//Once the user is authenticated and their session gets saved, their user details are saved to req.user.
  console.log(req.user._id);

  User.findById(req.user._id, function(err, foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret;
        foundUser.save(function(){
          res.redirect("/secrets");
        });
      }
    }
  });
});

module.exports=router;