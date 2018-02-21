var LocalStrategy   = require('passport-local'),
    passport        = require('passport'),
    express         = require('express'), 
    app             = express(), 
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    methodOverride  = require('method-override'),
    flash           = require('express-flash');

var commentsRoutes      = require('./routes/comments');
var campgroundRoutes    = require('./routes/campgrounds');
var authRoutes          = require('./routes/auth');

var Campground      = require('./models/campground');
var Comment         = require('./models/comment');
var User            = require('./models/user');
var seedDB          = require('./seeds');


// APP CONFIG
var url = process.env.DATABASEURL || "mongodb://127.0.0.1/yelp_camp";
mongoose.connect(process.env.DATABASEURL);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// seed the database 
// seedDB();

// passport config
app.use(require('express-session')({
    secret: "Being outside is cool",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware runs for every route
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});


// require routes 
app.use(authRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);


// Server settings 
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});