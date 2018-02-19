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
router.post('/', function(req, res) {
    // get data from form and push to db
    let name = req.body.name;
    let imageurl = req.body.image;
    let description = req.body.description;
    Campground.create(
        {
            name: name,
            image: imageurl,
            description: description,
        }, 
        function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log('NEW CAMPGROUND:')
            console.log(campground);
            // redirect back to campgrounds page 
            res.redirect("/campgrounds");
        }
    });
});

// NEW - form to create new campground
router.get('/new', function(req, res) {
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
            console.log(campground);
            // render Show template             
            res.render('campgrounds/show', {campground: campground});
        }
    });
});


module.exports = router;

