var Campground  = require('../models/campground');
var Comment     = require('../models/comment');

// all middleware goes here
var middlewareObj = {};

// isLoggedIn Middleware
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
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
                res.redirect('back');
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log('error: ', err);
                res.redirect('back');
            } 
            // does user own campground?
            else if (campground.author.id.equals(req.user._id)) {
                return next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        // not logged in
        res.redirect('back');
    }
}


module.exports = middlewareObj;