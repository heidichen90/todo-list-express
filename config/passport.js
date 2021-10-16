const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../models/user");
const bcrypt = require("bcryptjs");

//after you set up here it means that all the req, res can use passport as well

module.exports = (app) => {
  console.log("startegy middleware");
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
  console.log("facebook strategy");
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ["email", "displayName"],
      },
      (accessToken, refreshToken, profile, done) => {
        //profile is the data you get from facebook once user is autheticated
        const { email, name } = profile._json;
        User.findOne({ email }).then((user) => {
          if (user) return done(null, user);

          //create random password
          const randomPassword = Math.random().toString(36).slice(-8);
          //get password hash
          bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(randomPassword, salt))
            .then((hash) =>
              User.create({
                name,
                email,
                password: hash,
              })
            )
            .then((user) => done(null, user))
            .catch((err) => done(err, false));
        });
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
