const {Router} = require('express');
const router = Router();

//Validation
const validatorHandler = require('../../../middlewares/validator.handler');
//Schema
const {productRequiredId,productCartId} = require('../../../schemas/shopping-cart.schema');
const {userRequiredId} = require('../../../schemas/user.schema');
//Controller
const shoppingCartController = require('../../../controllers/shopping-cart.controller');

// /api/v1/shopping-cart/user/1
router.get('/find-user-cart/:id',
    validatorHandler(userRequiredId,'params'),
    shoppingCartController.createUserCart
);

//Add new product in the cart detail
router.post('/:cartid/product/:productid/new',
    validatorHandler(productCartId,'params'),
    shoppingCartController.addProductCartDetails
);

//Find all the user products in the cart detail
router.get('/:id/find-user-cart-details',   
    validatorHandler(productRequiredId,'params'),
    shoppingCartController.findUserCartDetails
);

//Increment the quantity of the product in the cart detail
router.put('/:cartid/product/:productid/add',
    validatorHandler(productCartId,'params'),
    shoppingCartController.incrementQuantityCartDetails
);

//Decrement the quantity of the product in the cart detail
router.put('/:cartid/product/:productid/subtract',
    validatorHandler(productCartId,'params'),
    shoppingCartController.decrementQuantityCartDetails
);

//Delete product in the cart detail
router.delete('/:cartid/product/:productid/cancel',
    validatorHandler(productCartId,'params'),
    shoppingCartController.deleteProductCartDetails
);

module.exports = router;