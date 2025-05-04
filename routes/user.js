const express = require("express");
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync')
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware')
const userController = require("../controllers/users");

// logOut
router.get("/logout", userController.logOut);
   
router.route("/login")
.get(userController.logInReq )
.post(
  saveRedirectUrl,
  passport.authenticate('local', 
  {
   failureRedirect: '/login' ,
   failureFlash:true
  }),
  userController.logIn

);

router.route('/signup')
.get(userController.signUpReq)
.post( wrapAsync(userController.signUp));


module.exports=router;