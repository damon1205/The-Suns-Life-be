const express = require('express');
var passport = require('passport');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { jwtStrategy } = require('./config/passport');
const session = require('express-session');
const { processGoogleAuth, processFaceBookAuth } = require('./modules/auth/auth.controllers');

const router = express.Router();

const remote_backend_url = process.env.REMOTE_BACKEND_API_URL;
const remote_web_url = process.env.REMOTE_BASE_URL;

const API_URL = remote_backend_url; //process.env.NODE_ENV === 'production' ? remote_backend_url : "http://localhost:3001";
const WEB_URL = remote_web_url; //process.env.NODE_ENV === 'production' ? remote_web_url : "http://localhost:3000";

passport.use('jwt', jwtStrategy);

router.use(session({
    secret: "secretg",
    resave: false,
    saveUninitialized: true,

}))

router.use(passport.initialize());
router.use(passport.session())

const authUser = async (request, accessToken, refreshToken, profile, done) => {
    console.log("from authUser", profile)
    const response = await processGoogleAuth(profile)
    console.log(response,'############data')
    let rt = response?.socialLink ?? '';
     //res.redirect(`${WEB_URL}/login?callbackUrl=${rt}`);
    return done(null, rt);
}

passport.use('google1', new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${API_URL}/web/auth/google/callback`,
    passReqToCallback: true
}, authUser));

router.get('/auth/google',
    passport.authenticate("google1", {
        scope:
            ["email", "profile"]
    }
    ));

router.get('/auth/google/callback',
    passport.authenticate('google1', {
        failureRedirect: `${WEB_URL}/`,
        session: false,
    }),
    (req, res) => {
        console.log(req.user, "from me in callback")
        res.redirect(`${WEB_URL}/?callbackUrl=${req.user}`);
    }
);

/* ---------------FACEBOOK---------------- */
const authUserFb = async (request, accessToken, refreshToken, profile, done) => {
    console.log("from authUserfb",profile)
    const response = await processFaceBookAuth(profile)
    
    let rt = response?.socialLink ?? '';
    // res.redirect(`${WEB_URL}/login?callbackUrl=${rt}`);
    return done(null, rt);
}
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
passport.use('facebook1', new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: `${API_URL}/web/auth/facebook/callback`,
}, authUserFb));

// router.get("/auth/facebook", passport.authenticate("facebook1"))
router.get('/auth/facebook',
    passport.authenticate("facebook1", {
        scope:
            ["public_profile","email"]
    }
    ));
router.get("/auth/facebook/callback", passport.authenticate('facebook1', { failureRedirect: '/' }),
    async function (req, res) {
        // Successful authentication, redirect home.
        let rt = req.user || '';
        res.redirect(`${WEB_URL}/?callbackUrl=${rt}`);
       
    });

module.exports = router;