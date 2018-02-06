const mongoose = require('mongoose');

// CAMPGROUND SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String, 
    image: String,
    description: String,
    comments: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "Comment"
    	}
    ],
});

// CAMPGROUND MODEL
module.exports = mongoose.model("Campground", campgroundSchema);
