const express = require('express');
var passport = require('passport');
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const { jwtStrategy } = require('./config/passport');
const session = require('express-session');
const { processGoogleAuth, processFaceBookAuth } = require('./modules/auth/auth.controllers');

const router = express.Router();

const remote_backend_url = process.env.REMOTE_BACKEND_API_URL;
const cbUrlGoogle = "stardust://login=google?"
const cbUrlFacebook = "stardust://login=facebook?"

const API_URL =  remote_backend_url; 

passport.use('jwt', jwtStrategy);

router.use(session({
    secret: "secretg",
    resave: false,
    saveUninitialized: true,

}))

router.use(passport.initialize());
router.use(passport.session())

const authUser = async(request, accessToken, refreshToken, profile, done) => {
    const response= await processGoogleAuth(profile)

    let rt = response?.socialLink ?? '';
    // res.redirect(`${WEB_URL}/login?callbackUrl=${rt}`);
    return done(null, rt);
}



passport.use('google2', new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${API_URL}/app/auth/google/callback`,
    passReqToCallback: true
},  authUser));


router.get('/auth/google',
    passport.authenticate("google2", {
        scope:
            ["email", "profile"]
    }
    ));


router.get('/auth/google/callback',
    passport.authenticate('google2', {
    failureRedirect: `${cbUrlGoogle}`,
    session: false,
    }),
    (req, res) => {
        // console.log("from me in callback")
        res.redirect(`${cbUrlGoogle}${req.user}`);
    }
);
/* ---------------FACEBOOK---------------- */
const authUserFb = async (request, accessToken, refreshToken, profile, done) => {
    // console.log("app authUserfb")
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
passport.use('facebook2', new FacebookStrategy({
    clientID: process.env['FACEBOOK_CLIENT_ID'],
    clientSecret: process.env['FACEBOOK_CLIENT_SECRET'],
    callbackURL: `${API_URL}/web/auth/facebook/callback`,
}, authUserFb));

router.get("/auth/facebook", passport.authenticate("facebook2"))
router.get("/auth/facebook/callback", passport.authenticate('facebook2', { failureRedirect: '/login' }),
    async function (req, res) {
        // Successful authentication, redirect home.
        let rt = req.user || '';
        res.redirect(`${cbUrlFacebook}${req.user}`);
    });
module.exports = router;