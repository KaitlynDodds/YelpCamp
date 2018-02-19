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

// check that user owns comment 
function checkCommentOwnership(req, res, next) {
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
                    // add username and id to comment
                    comment.author.username = req.user.username;
                    comment.author.id = req.user._id;
                    // save comment 
                    comment.save();
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

// EDIT
router.get('/:comment_id/edit', checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('back');
        } 
        res.render('comments/edit', {campground_id: req.params.id, comment: comment});
    });
});

// UPDATE
router.put('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('/campgrounds');
        }
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// DELETE
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('back');
        }
        // remove comment from campground
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                console.log('error: ', err);
                res.redirect('back');
            }
            res.redirect('/campgrounds/' + campground._id);
        });
    });
});


module.exports = router;