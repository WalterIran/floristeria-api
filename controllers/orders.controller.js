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

const allPendingOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const orders = await orderModel.findMany({
            where: {
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
            },
            skip: offset,
            take: limit,
            orderBy: [
                {
                    deliveryDate: 'asc'
                },
                {
                    billId: 'asc'
                }
            ]
        });

        const ordersCount = await orderModel.count({
            where: {
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

const allConfirmedOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const orders = await orderModel.findMany({
            where: {
                OR: [
                    {
                        orderStatus: 'completed'
                    },
                    {
                        orderStatus: 'canceled'
                    }
                ]
            },
            skip: offset,
            take: limit,
            orderBy: [
                {
                    deliveryDate: 'asc'
                },
                {
                    billId: 'asc'
                }
            ]
        });
        
        const ordersCount = await orderModel.count({
            where: {
                OR: [
                    {
                        orderStatus: 'completed'
                    },
                    {
                        orderStatus: 'canceled'
                    }
                ]
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

const getSellsStatistics = async (req, res, next) => {
    try {
        const sells = await prisma.$queryRaw`
            SELECT
            DATE_FORMAT(b.created_at, '%b') as 'month',
            sum(bd.quantity * bd.price) as 'sells'
            FROM bill as b
            inner join bill_detail as bd on bd.bill_id = b.bill_id
            where b.created_at > now() - INTERVAL 12 month AND order_status != 'canceled'
            group by DATE_FORMAT(b.created_at, '%b')
            ORDER BY b.created_at asc;
        `;

        res.status(200).json({status: 'ok', sells});

    } catch (error){
        next(error)
    }
}

const updateOrderStatus = async (req, res, next)=>{
    try {
        const billId = parseInt(req.params.id);
        
        const orderStatus = await orderModel.update({
            where:{
                billId
            },
            data:{
                orderStatus: req.body.status,
                employeeId: req.body.employeeId,
                updatedAt: new Date()
            }
        });
        if(!orderStatus){
            throw boom.notFound();
        }
        res.status(200).json("The order was modified successfully");

    } catch (error) {
        next(error);
    }
}

module.exports = { userPendingOrders, userConfirmedOrders, orderDetail, allPendingOrders, allConfirmedOrders, updateOrderStatus, getSellsStatistics };
