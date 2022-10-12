const GoogleStrategy = require("passport-google-oauth20");
const mongoose = require("mongoose");
const User = require("./models/user");


module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
        scope: [ 'profile' ],
        state: true
      },
      async (accessToken, refreshToken, profile, cb) => {
        console.log(profile)
        const newUser={
            googleId:profile.id,
            name: profile.displayName,
            image:profile.photos[0].value
        };
        try{
            let user= await User.findOne({googleId:profile.id})
            if(user){
              console.log('user exists so logging in')
                cb(null,user);
            }
            else{
              try{
                console.log('user dont exist so creating 1')
                user=await User.create(newUser);
                cb(null,user)
              }
              catch(err){
                console.log(err)
              }
               
            }
        }
        catch{err=>console.log(err)}
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
      done(null, user);
    });
  });
};
