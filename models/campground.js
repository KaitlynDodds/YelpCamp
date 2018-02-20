const mongoose = require('mongoose');

// CAMPGROUND SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String, 
    image: String,
    description: String,
    price: String, 
    comments: [
    	{
    		type: mongoose.Schema.Types.ObjectId,
    		ref: "Comment"
    	}
    ],
    author: {
    	id: {
    		type: mongoose.Schema.Types.ObjectId,
    		ref: 'User'
    	},
    	username: String
    }
});

// CAMPGROUND MODEL
module.exports = mongoose.model("Campground", campgroundSchema);
