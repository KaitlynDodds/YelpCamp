var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// temporary campgrounds array 
const campgrounds = [
    {
        name: "Salmon Creek",
        image: "https://farm5.staticflickr.com/4383/37386589826_0218e35baa.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"
    },
    {
        name: "Mountain Goats Rest",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"
    },
    {
        name: "Salmon Creek",
        image: "https://farm5.staticflickr.com/4383/37386589826_0218e35baa.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"
    },
    {
        name: "Mountain Goats Rest",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"
    },
    {
        name: "Salmon Creek",
        image: "https://farm5.staticflickr.com/4383/37386589826_0218e35baa.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"
    },
    {
        name: "Mountain Goats Rest",
        image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg"
    },
];

// set view engine
app.set('view engine', 'ejs');
// use body parser
app.use(bodyParser.urlencoded({extended: true}));

// landing page route
app.get('/', function(req, res) {
    res.render('landing');
});

// Campgrounds route 
app.get('/campgrounds', function(req, res) {
    res.render('campgrounds', {campgrounds: campgrounds});
});

// post route for campground 
app.post('/campgrounds', function(req, res) {
    // get data from form and add to campgrounds array
    let name = req.body.name;
    let imageurl = req.body.image;
    const newCampground = {name: name, image: imageurl};
    campgrounds.push(newCampground);
    // redirect back to campgrounds page 
    res.redirect("campgrounds");
});

// form to create new campground
app.get('/campgrounds/new', function(req, res) {
    res.render("new");
});

// Server settings 
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});