var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    flash = require('connect-flash'),
    passport = require('passport');

module.exports = function() {
    // Init express application
    var app = express();

    // Configure models
    require('../models/UserModel');

	// Enable logger (morgan)
    app.use(morgan('dev'));

    // Use Express middlewares
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(methodOverride());
    app.use(cookieParser());
    app.use(session({
    	secret: 'MEAN'
    }));

    // Connect flash for flash messages
    app.use(flash());

    // Init Passport 
    app.use(passport.initialize());
    app.use(passport.session());

    // Configure routing
    require('../routes/user')(app);

    return app;
};