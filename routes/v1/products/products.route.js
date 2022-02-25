const {Router} = require('express');
const router = Router();

const validatorHandler = require('../../../middlewares/validator.handler');
//Bringing up all schemas of products 
const {productRequiredId,changePrice} = require('../../../schemas/products.schema');
const productController = require('../../../controllers/product.controller');
//Find all products

router.get('/allproducts',productController.findAllProducts);
router.put('/:productid/product/:priceid/update',
validatorHandler(changePrice,'params'),
productController.modifyProductPrice);

module.exports = router;