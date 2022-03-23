const boom = require('@hapi/boom');
const prisma = require('../config/db');
const orderModel = prisma.bill;

const userPendingOrders = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const orders = await orderModel.findMany({
            skip: offset,
            take: limit,
            where: {
                AND: {
                    userId: id,
                    OR: [
                        {
                            orderStatus: 'processing'
                        },
                        {
                            orderStatus: 'received'
                        },
                        {
                            orderStatus: 'shipping'
                        }
                    ]
                }
            },
            orderBy: [
                {
                    deliveryDate: 'desc'
                },
                {
                    billId: 'desc'
                }
            ],
        });

        const ordersCount = await orderModel.count({
            where: {
                AND: {
                    userId: id,
                    OR: [
                        {
                            orderStatus: 'processing'
                        },
                        {
                            orderStatus: 'received'
                        },
                        {
                            orderStatus: 'shipping'
                        }
                    ]
                }
            }
        });

        const totalPages = Math.ceil(ordersCount/limit);

        const pagination = {
            totalItems: ordersCount,
            nextPage: page >= totalPages - 1 ? null : page + 1,
            limit,
            totalPages
        }
        
        res.status(200).json({
            status: 'ok',
            pagination,
            orders
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}

const userConfirmedOrders = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const orders = await orderModel.findMany({
            where: {
                AND: {
                    userId: id,
                    OR: [
                        {
                            orderStatus: 'completed'
                        },
                        {
                            orderStatus: 'canceled'
                        }
                    ]
                }
            },
            skip: offset,
            take: limit,
            orderBy: [
                {
                    deliveryDate: 'desc'
                },
                {
                    billId: 'desc'
                }
            ]
        });
        
        const ordersCount = await orderModel.count({
            where: {
                AND: {
                    userId: id,
                    OR: [
                        {
                            orderStatus: 'completed'
                        },
                        {
                            orderStatus: 'canceled'
                        }
                    ]
                }
            }
        });

        const totalPages = Math.ceil(ordersCount/limit);

        const pagination = {
            totalItems: ordersCount,
            nextPage: page >= totalPages - 1 ? null : page + 1,
            limit,
            totalPages
        }
        
        res.status(200).json({
            status: 'ok',
            pagination,
            orders
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

const orderDetail = async (req, res, next) => {
    try {
        const orderId = parseInt(req.params.id);

        const order = await orderModel.findUnique({
            where: {
                billId: orderId
            },
            include: {
                bill_detail: {
                    include: {
                        product: {
                            select: {
                                productName: true
                            }
                        }
                    }
                }
            }
        });

        if(!order) {
            throw boom.notFound();
        }

        order.subtotal = order.bill_detail.map(prod => parseFloat(prod.price * prod.quantity)).reduce((prev, next) => prev + next);
        order.total = parseFloat(order.subtotal) + parseFloat(order.taxAmount);

        res.status(200).json({
            status: 'ok',
            result: order
        });

    } catch (error) {
        console.error(error);
        next(error);
    }
}

module.exports = { userPendingOrders, userConfirmedOrders, orderDetail };