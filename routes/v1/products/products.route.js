const router = require('express').Router();

const validatorHandler = require('./../../../middlewares/validator.handler');
const { productIdSchema } = require('../../../schemas/products.schema');

const productController = require('../../../controllers/products.controller');

//localhost:5000/api/v1/products/byid/:id
router.get('/byid/:id', 
    validatorHandler(productIdSchema, 'params'),
    productController.findProduct
);



module.exports = router;