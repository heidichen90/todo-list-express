const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/user");

//after you set up here it means that all the req, res can use passport as well

module.exports = (app) => {
  //Middleware
  app.use(passport.initialize());
  app.use(passport.session());

  //Strategies
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, {
              message: "This email is not registered",
            });
          }

          if (user.password !== password) {
            return done(null, false, {
              message: "Email or Password incorrect",
            });
          }

          return done(null, user);
        })
        .catch((error) => done(error, false));
    })
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
