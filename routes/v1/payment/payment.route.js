const router = require('express').Router();

//Controllers
const paymentController = require('../../../controllers/payment.controller');

//Validation
const validatorHandler = require('../../../middlewares/validator.handler');

//Schema
const {registerBillDetailSchema, registerBillSchema} = require('../../../schemas/payment.schema');

router.post('/doPayment/', 
    paymentController.doPayment
);
router.post('/registerbill/', 
    validatorHandler(registerBillSchema, 'body'),
    paymentController.registerBill
);
router.post('/registerbilldetail/', 
    validatorHandler(registerBillDetailSchema, 'body'),
    paymentController.AddBilldetail
);

module.exports = router;