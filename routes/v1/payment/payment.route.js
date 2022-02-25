const router = require('express').Router();

//Controllers
const paymentController = require('../../../controllers/payment.controller');

router.post('/doPayment/', paymentController.doPayment);
router.post('/registerbill/', paymentController.registerBill);
router.post('/registerbilldetail/', paymentController.AddBilldetail);

module.exports = router;