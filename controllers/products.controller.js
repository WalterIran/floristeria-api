const boom = require('@hapi/boom');
const prisma = require('../config/db');
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
        const { productName , productDescriptionTitle, productDescription, productImgUrl,
            price, discount, totalRating } = req.body;

        const data = {
            productName,
            productImgUrl,
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
const updateoneProduct = async (req, res, next) => {
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


module.exports = { findProduct, deleteProduct, createProduct,updateoneProduct};
