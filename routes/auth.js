const express   = require('express'),
      passport  = require('passport');

const router    = express.Router();

var Campground  = require('../models/campground');
var Comment     = require('../models/comment');
var User        = require('../models/user');

const middlewareObj = require('../middleware');

// landing page route
router.get('/', function(req, res) {
    res.render('landing');
});

// show register form
router.get('/register', function(req, res) {
    res.render('auth/register');
});

// handle register logic
router.post('/register', function(req, res) {
    const newUser = new User({username: req.body.username});
    User.register( newUser, req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            req.flash('error', err.message);
            return res.render('auth/register');
        } 
        passport.authenticate("local")(req, res, function() {
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        });
    });
});

// show login form
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// handle login logic
router.post('/login', passport.authenticate('local', 
    {
        successRedirect: '/campgrounds', 
        failureRedirect: '/login',
        failureFlash: 'Invalid username or password.'
    }), (req, res) => {

});

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
});


module.exports = router;
