const router = require('express').Router();
const passport = require('passport');

//Validation
const validatorHandler = require('./../../../middlewares/validator.handler');

//Schemas
const { userRequiredId, registerCustomerSchema, updateCustomerInfoSchema, inactivateUser, registerEmployeeSchema } = require('./../../../schemas/user.schema');

//Controller
const userController = require('./../../../controllers/users.controller');

router.get('/all', userController.findAll);//Missing authentication
router.get('/all-employee', userController.findAllEmployees);//Missing authentication

router.get('/byid/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(userRequiredId, 'params'),
    userController.findOneUser
);

router.post('/register-customer', 
    validatorHandler(registerCustomerSchema, 'body'),
    userController.registerCustomer
);

router.post('/register-employee', 
    validatorHandler(registerEmployeeSchema, 'body'),
    userController.registerEmployee
);

router.patch('/update-customer/:id', 
    passport.authenticate('jwt', {session: false}),
    validatorHandler(userRequiredId, 'params'),
    validatorHandler(updateCustomerInfoSchema, 'body'),
    userController.updateOneUser
);

router.put('/activate-user/:id',
    validatorHandler(userRequiredId, 'params'),
    userController.activateUser
);

router.delete('/inactivate-user/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(userRequiredId, 'params'),
    userController.inactivateUser
);

module.exports = router;