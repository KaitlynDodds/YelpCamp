var express = require('express');
var app = express();

// set view engine
app.set('view engine', 'ejs');

// landing page route
app.get('/', function(req, res) {
    res.render('landing');
});

// Campgrounds route 
app.get('/campgrounds', function(req, res) {

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
        }
    ];

    res.render('campgrounds', {campgrounds: campgrounds});
});

// Server settings 
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});