const router = require('express').Router();

const validatorHandler = require('./../../../middlewares/validator.handler');
const { searchSchema } = require('../../../schemas/search.schema');

const searchController = require('../../../controllers/search.controller');

//localhost:5000/api/v1/search/products
router.get('/products', 
    validatorHandler(searchSchema, 'query'),
    searchController.searching
);

module.exports = router;

