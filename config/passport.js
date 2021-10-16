const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/user");
const bcrypt = require("bcryptjs");

//after you set up here it means that all the req, res can use passport as well

module.exports = (app) => {
  //Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //local strategy
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            console.log("no users");
            return done(null, false, {
              message: "This email is not registered",
            });
          }
          return bcrypt.compare(password, user.password).then((isMatch) => {
            if (!isMatch) {
              return done(null, false, {
                message: "Email or Password incorrect",
              });
            }

            return done(null, user);
          });
        })
        .catch((error) => console.warn(error));
    })
  );

  //facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        clientID: "401112891372089",
        clientSecret: "15ec637099764c328f015859b6157cc7",
        callbackURL: "http://localhost:3000/auth/facebook/callback",
        profileFields: ["email", "displayName"],
      },
      function (accessToken, refreshToken, profile, done) {
        console.log(profile);
      }
    )
  );

  //Session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};
