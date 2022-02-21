const router = require('express').Router();
const passport = require('passport');

//Validation
const validatorHandler = require('./../../../middlewares/validator.handler');

//Schemas
const { userRequiredId, registerCustomerSchema, updateCustomerInfoSchema } = require('./../../../schemas/user.schema');

//Controller
const userController = require('./../../../controllers/users.controller');

router.get('/all', userController.findAll);

router.get('/byid/:id',
    validatorHandler(userRequiredId, 'params'),
    userController.findOneUser
);

router.post('/register-customer', 
    validatorHandler(registerCustomerSchema, 'body'),
    userController.registerCustomer
);

router.patch('/update-customer/:id', 
    passport.authenticate('jwt', {session: false}),
    validatorHandler(userRequiredId, 'params'),
    validatorHandler(updateCustomerInfoSchema, 'body'),
    userController.updateOneCustomer
);

module.exports = router;