const prisma = require('../config/db');
const boom = require('@hapi/boom');
const productModel = prisma.product;
const cartDetailModel = prisma.cart_detail;

//Function add new product or increment the quantity of the same product in the cart detail
const addProductCartDetails = async (req,res,next)=>{
    try {
        const cartId = parseInt(req.params.cartid);
        const productId = parseInt(req.params.productid);
        const product = await findProductById(req.params.productid);
        const cartDetails = await cartDetailModel.upsert({
            where:{
                cartId_productId:{
                    cartId,productId
                }
            },
            update:{
                productId,
                price:product.price,
                quantity:{increment:1}
            },
            create:{
                product:{
                    connect:{id:productId}
                },
                cart:{
                    connect:{id:cartId}
                },
                quantity:1,
                price:product.price
            }
        });
        if(!cartDetails){
            throw boom.notFound();
        }else{
            res.send('Producto agregado.')
        }
    } catch (error) {
        next(error);
    }
}
//Function to find products by her id
const findProductById = async(producId)=>{
    const id = parseInt(producId);
    const product = await productModel.findUnique({
        where:{id}
    });
    return product;
}
//Function find all the user products on the cart details
const findUserCartDetails = async (req,res,next)=>{
    try {
        const id = parseInt(req.params.id);
        const cartDetails = await cartDetailModel.findMany({
            where:{
                cart: {
                    AND:[
                        {
                            userId:id 
                        },
                        {
                           status: 'active' 
                        }
                    ]
                }
            },
            include:{
                product: {
                    select:{name:true,image:true}
                },
                cart:{
                    select:{userId:true}
                }
            }
        });
        if(!cartDetails){
            throw boom.notFound();
        }
        res.send(cartDetails);
    } catch (error) {
        next(error);
    }
}
//Function to increment the quantity of the product of the cart detail
const incrementQuantityCartDetails = async (req,res)=>{
    const cartId = parseInt(req.params.cartid);
    const productId = parseInt(req.params.productid);
    const cartDetails = await cartDetailModel.update({
        where:{
            cartId_productId:{
                cartId: cartId,
                productId: productId,          
            }
        },
        data:{
            quantity:{increment:1}
        }
    });
    if(!cartDetails.productId || !cartDetails.cartId){
        throw boom.notFound();
    }else{
        res.send(cartDetails);
    }
}
//Function to decrement the quantity of the product of the cart details
const decrementQuantityCartDetails = async (req,res)=>{
    const cartId = parseInt(req.params.cartid);
    const productId = parseInt(req.params.productid);
    const cartDetails = await cartDetailModel.update({
        where:{
            cartId_productId:{
                cartId: cartId,
                productId: productId,          
            }
        },
        data:{
            quantity:{decrement:1}
        }
    });
    if(!cartDetails){
        throw boom.notFound();
    }else{
        res.send(cartDetails);
    }
}
//Function delete product of a cart details
const deleteProductCartDetails = async (req,res)=>{
        const cartId = parseInt(req.params.cartid);
        const productId = parseInt(req.params.productid);
        const cartDetails = await cartDetailModel.delete({
            where:{
                cartId_productId:{
                    cartId:cartId,
                    productId:productId,
                }
            }
        });
        if(!cartDetails){
            throw boom.notFound();
        }else{
            res.send('Product cancelled.');
            console.log(cartDetails);
        }

}

module.exports = {addProductCartDetails,findUserCartDetails, incrementQuantityCartDetails, decrementQuantityCartDetails, deleteProductCartDetails};