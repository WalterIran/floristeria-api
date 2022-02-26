const prisma = require('../config/db');
const boom = require('@hapi/boom');
const productModel = prisma.product;

const findAllProducts = async (req,res,next) =>{
    try {
        const product = await productModel.findMany();
        res.send(product);
    } catch (error) {
        console.log(error)
        next(error);
    }
}
//Posible fuction to change price in a product
const modifyProductPrice = async (req,res,next)=>{
    try {
       const productId = parseInt(req.params.productid);
       const changePrice = parseInt(req.params.priceid);
       const products = await productModel.update({
           where: {
               id: productId
            },
          data: {
              price:changePrice
          }
       })
       if(!products){
           throw boom.notFound();
       }else{
           res.send('Precio Actualizado.');
       }
    }catch (error) {
        next(error);
    }
}

module.exports = {findAllProducts, modifyProductPrice};