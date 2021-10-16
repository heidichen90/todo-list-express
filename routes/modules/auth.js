const express = require("express");
const router = express.Router();

const passport = require("passport");

//for facebook login button
//scope: what data you need to get from facebook
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
  })
);

//facebook's callback. facebook send back after authenticate user
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/users/login",
  })
);

module.exports = router;
