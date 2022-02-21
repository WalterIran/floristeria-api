const { ExtractJwt, Strategy } = require('passport-jwt');

const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const options = {
    secretOrKey: secretAccessKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

//Passport Strategy for authentication using jwt
const JWTStrategy = new Strategy(options, (payload, done) => {
    return done(null, payload)
});

module.exports = JWTStrategy;