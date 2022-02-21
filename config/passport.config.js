const passport = require('passport');

const LocalStrategy = require('../auth/local.strategy');
const JWTStrategy = require('../auth/jwt.strategy');

passport.use('local',LocalStrategy);
passport.use('jwt',JWTStrategy);