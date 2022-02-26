const router = require('express').Router();
const passport = require('passport');

const validatorHandler = require('./../../../middlewares/validator.handler');
const { productIdSchema, productDeleteSchema, createProductSchema, updateProductSchema  } = require('../../../schemas/products.schema');

const productController = require('../../../controllers/products.controller');

//localhost:5000/api/v1/products/byid/:id
router.get('/byid/:id', 
    validatorHandler(productIdSchema, 'params'),
    productController.findProduct
);

router.delete('/delete/:id',
    passport.authenticate('jwt', {session: false}),
    validatorHandler(productDeleteSchema, 'params'),
    productController.deleteProduct
);

router.post('/create',
passport.authenticate('jwt', {session: false}),
validatorHandler(createProductSchema, 'body'),
productController.createProduct
);

router.patch('/update/:id', 
    //passport.authenticate('jwt', {session: false}),
    validatorHandler(productIdSchema, 'params'),
    validatorHandler(updateProductSchema, 'body'),
    productController.updateoneProduct
);

module.exports = router;