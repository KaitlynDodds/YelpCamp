const express   = require('express');

const router = express.Router({mergeParams: true});

var Campground      = require('../models/campground');
var Comment         = require('../models/comment');
var User            = require('../models/user');

// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

// NEW
router.get('/new', isLoggedIn, function(req, res) {
    // find campground
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground});
        }
    });
});

// CREATE
router.post('/', isLoggedIn, function(req, res) {
    // lookup campground
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
            res.redirect('/');
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                // push comment to campground
                    campground.comments.push(comment.id);
                    campground.save();
                // redirect back to campground show
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});


module.exports = router;