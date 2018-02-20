const express   = require('express');

const router = express.Router({mergeParams: true});

var Campground      = require('../models/campground');
var Comment         = require('../models/comment');
var User            = require('../models/user');

const middlewareObj = require('../middleware');

// NEW
router.get('/new', middlewareObj.isLoggedIn, function(req, res) {
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
router.post('/', middlewareObj.isLoggedIn, function(req, res) {
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
                    req.flash('success', 'Created new comment');
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    });
});

// EDIT
router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('back');
        } 
        res.render('comments/edit', {campground_id: req.params.id, comment: comment});
    });
});

// UPDATE
router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('/campgrounds');
        }
        req.flash('success', 'Updated comment');
        res.redirect('/campgrounds/' + req.params.id);
    });
});

// DELETE
router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, comment) => {
        if (err) {
            console.log('error: ', err);
            res.redirect('back');
        }
        req.flash('success', 'Removed comment');
        res.redirect('/campgrounds/' + req.params.id);
    });
});


module.exports = router;