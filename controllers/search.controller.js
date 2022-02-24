const boom = require('@hapi/boom');
const prisma = require('../config/db');
const productModel = prisma.product;

const searching = async (req, res, next) => {
    try {
        const { search } = req.query;

        const products = await productModel.findMany({
            where: {
                OR: [
                    {
                        productName: {
                            contains: search
                        },
                    },
                    {
                        product_description_title: {
                            contains: search
                        }
                    },
                    {
                        product_tag: {
                            some:{
                                tag: {
                                    tag_name: {
                                        contains: search
                                    }
                                }
                            }
                        }
                    }
                ]
            },
            include: {
                product_tag: {
                    include: {
                        tag: true
                    }
                }
            }
        });

        res.status(200).json({
            status: 'ok',
            products
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { searching };
