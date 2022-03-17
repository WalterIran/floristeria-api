const boom = require('@hapi/boom');
const { not } = require('joi');
const prisma = require('../config/db');
const showModel = prisma.product;

const showing = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const { show } = req.query;

        const product = await showModel.findMany({


            select: {
                id: true,
                productName: true,
                productDescriptionTitle: true,
                price: true,
                productImgUrl: true

            },
            take: limit,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        });

        res.status(200).json({
            status: 'ok',
            product
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
}

const showingd = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 6;
        const { show } = req.query;

        const product = await showModel.findMany({
            where: { NOT:
                [{ discount: null }]
               },

            select: {
                id: true,
                productName: true,
                productDescriptionTitle: true,
                price: true,
                productImgUrl: true,
                discount: true
                

            },
            take: limit,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ]
        });

        res.status(200).json({
            status: 'ok',
            product
        })

    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { showing, showingd };