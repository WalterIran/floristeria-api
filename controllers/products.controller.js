const boom = require('@hapi/boom');
const prisma = require('../config/db');
const { uploadFile } = require('../config/s3');
const productModel = prisma.product;

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
            totalRating 
        } = req.body;

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
            discountExpirationDate: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            totalRating
        }

        const product = await productModel.create({
            data
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
     const product = await productModel.update({
         where: {
             id: id
         },
         data: {
             ...changes,
             updatedAt: new Date()
         }
     });
     
     if(!product){
        throw boom.notFound();
     }
     
     res.status(200).json({
         status: 'ok',
         result: product
     });
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


module.exports = { findProduct, findNewestProducts, findDiscountProducts, deleteProduct, createProduct, updateOneProduct};
