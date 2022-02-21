const router = require('express').Router();
const passport = require('passport');
const validatorHandler = require('./../../../middlewares/validator.handler');

//Controller
const authController = require('./../../../controllers/auth.controller');

//Schemas
const { authLoginSchema } = require('../../../schemas/auth.schema');
const { userRequiredId } = require('../../../schemas/user.schema');

router.post('/mobile/login', 
    validatorHandler(authLoginSchema, 'body'),
    passport.authenticate('local', {session: false}),
    authController.mobileLogin
);

router.post('/mobile/refresh-token/:id', 
    validatorHandler(userRequiredId, 'params'),
    authController.mobileRefreshToken
);

module.exports = router;
