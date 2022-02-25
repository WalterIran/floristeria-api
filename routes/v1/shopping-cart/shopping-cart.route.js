const {Router} = require('express');
const router = Router();

//Validation
const validatorHandler = require('../../../middlewares/validator.handler');
//Schema
const {productRequiredId,productCartId} = require('../../../schemas/shopping-cart.schema');
//Controller
const shoppingCartController = require('../../../controllers/shopping-cart.controller');

//Add new product in the cart detail
router.post('/:cartid/product/:productid/new',
validatorHandler(productCartId,'params'),
shoppingCartController.addProductCartDetails);
//Find all the user products in the cart detail
router.get('/:id/find',
validatorHandler(productRequiredId,'params'),
shoppingCartController.findUserCartDetails);
//Increment the quantity of the product in the cart detail
router.put('/:cartid/product/:productid/add',
validatorHandler(productCartId,'params'),
shoppingCartController.incrementQuantityCartDetails);
//Decrement the quantity of the product in the cart detail
router.put('/:cartid/product/:productid/subtract',
validatorHandler(productCartId,'params'),
shoppingCartController.decrementQuantityCartDetails);
//Delete product in the cart detail
router.delete('/:cartid/product/:productid/cancel',
validatorHandler(productCartId,'params'),
shoppingCartController.deleteProductCartDetails);

module.exports = router;