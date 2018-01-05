var express     = require('express'), 
    app         = express(), 
    bodyParser  = require('body-parser'),
    mongoose    = require('mongoose');

// connect to db 
mongoose.connect("mongodb://localhost/yelp_camp");

// CAMPGROUND SCHEMA
var campgroundSchema = new mongoose.Schema({
    name: String, 
    image: String,
});

// CAMPGROUND MODEL
var Campground = mongoose.model("Campground", campgroundSchema);

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
    // get all campgrounds from db
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds', {campgrounds: campgrounds});    
        }
    });
});

// post route for campground 
app.post('/campgrounds', function(req, res) {
    // get data from form and push to db
    let name = req.body.name;
    let imageurl = req.body.image;
    Campground.create(
        {
            name: name,
            image: imageurl
        }, 
        function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log('NEW CAMPGROUND:')
            console.log(campground);
        }
    });
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