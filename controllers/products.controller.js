const boom = require('@hapi/boom');
const prisma = require('../config/db');
const { uploadFile } = require('../config/s3');
const productModel = prisma.product;

const findAllProducts = async (req,res,next) =>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const [products, productsCount] = await prisma.$transaction([
            productModel.findMany({
                skip: offset,
                take: limit,
                orderBy: [
                    {
                        createdAt: 'asc'
                    },
                    {
                        id: 'asc'
                    }
                ],
                include: {
                    product_tag:{
                        include:{
                            tag: true
                        }
                    }
                }
            }),
            productModel.count(),
        ]);

        const totalPages = Math.ceil(productsCount/limit);

        const pagination = {
            totalItems: productsCount,
            nextPage: page >= totalPages ? null : page + 1,
            limit,
            totalPages
        }

        res.status(200).json({
            status: 'ok',
            pagination, 
            products
        });
    } catch (error) {
        console.log(error)
        next(error);
    }
}

//Search Product
const findProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const product = await productModel.findUnique({
            where: {
                id
            },
            include: {
                product_tag: {
                    include: {
                        tag: true
                    }
                }
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


//Delete Product
const deleteProduct = async (req, res, next) => {
    
    try {
        const id = parseInt(req.params.id);

        const product = await productModel.delete({
          where:{
              id: id
          } 
        });

    res.status(200).json({status: 'ok', product});
    } catch (error) {
        console.error(error);
        next(error);
    }
}

//Create Product
const createProduct = async (req, res, next) => {
    try {
        const { 
            productName, 
            productDescriptionTitle, 
            productDescription,
            price, 
            discount, 
            discountExpirationDate,
            tagIds
        } = req.body;

        const tagIdArr = JSON.parse(tagIds);

        const tagTransaction = tagIdArr.map((tag) => {
            return {
                tagId: tag
            }
        });
        
        const productImage = req.file;

        const result = await uploadFile(productImage);

        const data = {
            productName,
            productImgUrl: result.Location,
            productDescriptionTitle,
            productDescription,
            price,
            status: 'ACT',
            discount,
            discountExpirationDate: new Date(discountExpirationDate),
            createdAt: new Date(),
            updatedAt: new Date(),
            totalRating: 0
        }

        const product = await productModel.create({
            data: {
                ...data,
                product_tag: {
                    create: tagTransaction
                }
            }
        });

        res.status(200).json({status: 'ok', product});
        }catch (error) {
        console.error(error);
        next(error);
    }
}

//update Product 
const updateOneProduct = async (req, res, next) => {
    try{
        const id = parseInt(req.params.id);
        const changes = req.body;
        
        const tagIdArr = JSON.parse(changes.tagIds);
        delete changes['tagIds'];

        const productImage = req.file;

        const result = productImage && await uploadFile(productImage);
        if(result){
            changes.productImgUrl = result.Location;
        }

        const tagTransaction = tagIdArr.map((tag) => {
            return {
                tagId: tag
            }
        });

        const product = await productModel.update({
            where: {
                id: id
            },
            data: {
                ...changes,
                discountExpirationDate: new Date(changes.discountExpirationDate),
                updatedAt: new Date(),
                product_tag: {
                    deleteMany: {},
                    create: tagTransaction
                }
            }
        });
        
        if(!product){
            throw boom.notFound();
        }
        
        res.status(200).json({
            status: 'ok',
            result: product
        });
        //res.status(200).json({status: 'ok'});
    } catch(error){
        next(error);
    }
}

//Get newest products
const findNewestProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        const products = await productModel.findMany({
            take: limit,
            orderBy: [
                {
                    createdAt: 'desc'
                }
            ],
            include: {
                product_tag:{
                    include:{
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
        next(error);
    }
}

//Get discount products
const findDiscountProducts = async (req, res, next) => {
    try {
        const limit = parseInt(req.query.limit) || 6;

        const products = await productModel.findMany({
            where: { 
                OR: [
                    {
                        AND: [
                            { 
                                NOT: {
                                    discount: null 
                                }
                            },
                            {
                                NOT: {
                                    discountExpirationDate: null 
                                }
                            },
                            {
                                NOT: {
                                    discountExpirationDate: {
                                        gt: new Date()
                                    } 
                                }
                            },
                        ]
                    },
                    {
                        AND:[
                            {
                                product_tag:{
                                    some: {
                                        tag:{
                                            NOT: {
                                                discount : null
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                product_tag:{
                                    some: {
                                        tag:{
                                            NOT: {
                                                discountExpirationDate : null
                                            }
                                        }
                                    }
                                }
                            },
                            {
                                product_tag:{
                                    some: {
                                        tag:{
                                            NOT: {
                                                discountExpirationDate : {
                                                    gt: new Date()
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                        ]
                    }
                ]
            },
            include: {
                product_tag:{
                    include: {
                        tag:true
                    }
                }
            },
            take: limit,
            orderBy: [
                {
                    discount: 'desc'
                }
            ]
        });

        res.status(200).json({
            status: 'ok',
            products
        })

    } catch (error) {
        next(error);
    }
}


module.exports = { findAllProducts, findProduct, findNewestProducts, findDiscountProducts, deleteProduct, createProduct, updateOneProduct};
