const express   = require('express');

const router    = express.Router();

var Campground  = require('../models/campground');
var Comment     = require('../models/comment');
var User        = require('../models/user');



// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// INDEX - all campgrounds
router.get('/', function(req, res) {
    // get all campgrounds from db
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/index', {campgrounds: campgrounds});    
        }
    });
});

// CREATE 
router.post('/', isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.campground, (err, campground) => {
        if (err) {
            console.log(err);
        } else {
            // add user to campground
            campground.author = author;
            // save campground
            campground.save();
            // redirect back to campgrounds page 
            res.redirect("/campgrounds");
        }
    });
});

// NEW - form to create new campground
router.get('/new', isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

// SHOW - show more info about campground
router.get('/:id', function(req, res) {
    // TODO: find campground w/ provided id
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            // render Show template             
            res.render('campgrounds/show', {campground: campground});
        }
    });
});

// EDIT - form 
router.get('/:id/edit', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', {campground: campground});
    })
});

// UPDATE 
router.put('/:id', isLoggedIn, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, campground) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('/campgrounds');
        }
        res.redirect('/campgrounds/' + campground._id);
    });
});

module.exports = router;

