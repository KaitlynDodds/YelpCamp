var Campground  = require('../models/campground');
var Comment     = require('../models/comment');

// all middleware goes here
var middlewareObj = {};

// isLoggedIn Middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'User Login Required');
    res.redirect('/login');
}

// check that user owns comment 
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        // check that user owns comment
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                console.log('error: ', err);
                res.redirect('back');
            } if (comment.author.id.equals(req.user._id)) {  // check that current user owns comment
                return next();
            } else { // current user does not own comment
                req.flash('error', 'Unauthorized User');
                res.redirect('back');
            }
        });
    } else {
        req.flash('error', 'User Login Required');
        res.redirect('back');
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log('error: ', err);
                req.flash('error', 'Unable to Retrieve Campground');
                res.redirect('back');
            } 
            // does user own campground?
            else if (campground.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash('error', 'Unauthorized User');
                res.redirect('back');
            }
        });
    } else {
        // not logged in
        req.flash('error', 'User Login Required');
        res.redirect('back');
    }
}


module.exports = middlewareObj;