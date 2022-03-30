const Joi = require('joi');

//Types.
const id = Joi.number().positive();
const tagName = Joi.string().max(255);
const tagDescription = Joi.string().max(1500);
const discount = Joi.number().positive().precision(2).allow(null);
const discountExpirationDate = Joi.string().max(1500);

//Schemas

const TagsIdSchema =   Joi.object({
    tagId: id.required()
});

const createTagsSchema = Joi.object({
    tagName: tagName.required(),
    tagDescription: tagDescription.required(),
    discount,
    discountExpirationDate
});

const updateTagsSchema = Joi.object({
    tagName,
    tagDescription,
    discount,
    discountExpirationDate
});


module.exports = {TagsIdSchema, updateTagsSchema, createTagsSchema};