const router = require('express').Router();
const passport = require('passport');

const validatorHandler = require('./../../../middlewares/validator.handler');
const { TagsIdSchema, updateTagsSchema, createTagsSchema } = require('../../../schemas/tags.schema');

const tagsController = require('../../../controllers/tags.controller');

//localhost:5000/api/v1/tags/listTags
router.get('/listTags',
    tagsController.findAllTags
);

router.patch('/updateTag/:tagId',
    validatorHandler(TagsIdSchema, 'params'),
    validatorHandler(updateTagsSchema, 'body'),
    tagsController.updateTag
);

router.get('/findtag/:tagId',
    validatorHandler(TagsIdSchema, 'params'),
    tagsController.finOneTag
)

router.post('/createTags',
    validatorHandler(createTagsSchema, 'body'),
    tagsController.createTag
);

router.delete('/deleteTag/:tagId',
    validatorHandler(TagsIdSchema, 'params'),
    tagsController.deleteTag
);

module.exports = router;
router.get('/top-sold',
    tagsController.getTopSoldTags
);

module.exports  = router;
