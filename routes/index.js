const express =require("express")
var router = express.Router();
const userModel =require("./users.js");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ,"email" ]
}, async function verify(issuer, profile, cb) {
   try{
    let existingUser = await userModel.findOne({email: profile.emails[0].value})
    if(existingUser){
      return cb(null, existingUser)
    } else{
      let newUser = await userModel.create({name:profile.displayName,email:[0].value})
      return cb (null, newUser)
    }
   }catch(err){
    console.log(err)
    return err;

   }
}));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
router.get('/login', function(req, res, next) {
  if(!req.user){
    res.render('login');
  } else{
    res.redirect("/")
  }
});

router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

module.exports = router;
