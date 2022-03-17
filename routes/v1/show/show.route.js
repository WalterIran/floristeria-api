const router = require('express').Router();
const showController = require('../../../controllers/show.controller');

router.get('/show',
showController.showing
);

router.get('/discount',
showController.showingd
);
module.exports = router;
