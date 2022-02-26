const { ExtractJwt, Strategy } = require('passport-jwt');
const boom = require('@hapi/boom');
const userController = require('../controllers/users.controller');

const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const options = {
    secretOrKey: secretAccessKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

//Passport Strategy for authentication using jwt
const JWTStrategy = new Strategy(options, async (payload, done) => {
    try {
        const user = await userController.findById(payload.userId);

        if (user.userStatus === 'INA') {
            throw boom.unauthorized();
        }

        return done(null, payload)
    } catch (error) {
        return done(error, false);
    }
});

module.exports = JWTStrategy;