var users = require('./controllers/user.controller'),
    passport = require('passport');

module.exports = function(app) {
    // Setting up the local authentication
    app.route('/auth/signup').post(users.signup);
    app.route('/auth/signin').post(users.signin);
    app.route('/users').get(users.getUsers);
    app.route('/user/delete').post(users.deleteUser);
};