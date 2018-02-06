var express     = require('express'), 
    app         = express(), 
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');


// APP CONFIG
mongoose.connect("mongodb://localhost/yelp_camp");
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
seedDB();


// landing page route
app.get('/', function(req, res) {
    res.render('landing');
});

// INDEX - Campgrounds route 
app.get('/campgrounds', function(req, res) {
    // get all campgrounds from db
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('index', {campgrounds: campgrounds});    
        }
    });
});

// CREATE - post route for campground 
app.post('/campgrounds', function(req, res) {
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
app.get('/campgrounds/new', function(req, res) {
    res.render("new");
});

// SHOW - show more info about campground
app.get('/campgrounds/:id', function(req, res) {
    // TODO: find campground w/ provided id
    var id = req.params.id;
    Campground.findById(id).populate("comments").exec(function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log(campground);
            // render Show template             
            res.render('show', {campground: campground});
        }
    });
});

// Server settings 
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});