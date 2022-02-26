const boom = require('@hapi/boom');
const passport = require('passport');
const { Strategy } = require('passport-local');

//Controller
const authController = require('../controllers/auth.controller');

const options = {
    usernameField: 'email',
    passwordField: 'password',
}

//Passport Strategy for email and password verification 
const LocalStrategy = new Strategy(options, async (email, password, done) => {
    try {
        const user = await authController.getUser(email, password);

        if (user.userStatus === 'INA') {
            throw boom.unauthorized();
        }

        done(null, user);
    } catch (error) {
        done(error, false);
    }
});

module.exports = LocalStrategy;

