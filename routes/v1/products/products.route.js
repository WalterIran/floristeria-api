const router = require('express').Router();
const passport = require('passport');
const multer = require('multer');

const upload = multer({dest: '../../../uploads/'})

const validatorHandler = require('./../../../middlewares/validator.handler');
const { productIdSchema, productDeleteSchema, createProductSchema, updateProductSchema  } = require('../../../schemas/products.schema');

const productController = require('../../../controllers/products.controller');

//localhost:5000/api/v1/products/byid/:id
router.get('/byid/:id', 
    validatorHandler(productIdSchema, 'params'),
    productController.findProduct
);

router.get('/newest',
    productController.findNewestProducts
);

router.get('/with-discount',
    productController.findDiscountProducts
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
    productController.updateOneProduct
);

module.exports = router;