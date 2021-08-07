const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../../models/user");

router.get("/login", (req, res) => {
  console.log("here");
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "users/login",
  })
);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      console.log("User already exist.");
      res.render("register", {
        name,
        email,
        password,
        confirmPassword,
      });
    } else {
      //create a new user
      return User.create({ name, email, password })
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    }
  });
  res.render("register");
});

router.get("/logout", (req, res) => {
  //calling logout, passport will automatically clear out the session
  req.logout();
  res.redirect("/users/login");
});

module.exports = router;
