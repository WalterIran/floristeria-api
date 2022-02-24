const boom = require('@hapi/boom');
const prisma = require('../config/db');
const productModel = prisma.product;

const findProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const product = await productModel.findUnique({
            where: {
                id
            }
        });

        if (!product) {
            throw boom.notFound();
        }

        res.status(200).json({status: 'ok', product});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { findProduct };
