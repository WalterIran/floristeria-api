const prisma = require('../config/db');
const boom = require('@hapi/boom');
const productModel = prisma.product;
const cartDetailModel = prisma.cart_detail;
const cartModel = prisma.cart;
const userController = require('../controllers/users.controller');

//Function  to create shopping cart for the user
const createUserCart = async (req,res,next)=>{
    try {
        const userId = parseInt(req.params.id);
        const carts = await cartModel.findMany({
            where:{AND:[{
                status:'active',
                userId:userId,
            }]}
        });
        const user = await userController.findById(userId);
        if(user == false){
            throw boom.notFound();
        }
        if(carts == false){
            const cart = await cartModel.create({
            data:{
                createdAt: new Date,
                status: 'active',
                userId,
            }
            });
            res.status(200).json(cart);
        }else{
            res.status(200).json({cartId: carts[0].id});
        }
    } catch (error) {
        next(error);
    }
}
//Function add a new product or increment the quantity of the same product in the cart detail
const addProductCartDetails = async (req,res,next)=>{
    try {
        const cartId = parseInt(req.params.cartid);
        const productId = parseInt(req.params.productid);
        const sentPrice = parseFloat(req.body.price);

        const carts= await cartModel.findMany({
            where:{AND:[{
                status:'active',
                id:cartId
            }]}
        });
        if(carts == false){
            throw boom.notFound();
        }
        const product = await findProductById(req.params.productid);
        const cartDetails = await cartDetailModel.upsert({
            where:{
                cartId_productId:{
                    cartId,productId
                }
            },
            update:{
                productId,
                price: sentPrice,
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
                price:sentPrice
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
    if(!product){
        throw boom.notFound();
    }else{
        return product;
    }
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
                    select:{productName:true,productImgUrl:true}
                },
                cart:{
                    select:{userId:true}
                }
            }
        });
        res.status(200).json(cartDetails);
    } catch (error) {
        next(error);
    }
}
//Function to increment the quantity of the product of the cart detail
const incrementQuantityCartDetails = async (req,res,next)=>{
    try {
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
        if(!cartDetails){
            throw boom.notFound();
        }
        res.status(200).json(cartDetails);

    } catch (error) {
        next(error);
    }
}
//Function to decrement the quantity of the product of the cart details
const decrementQuantityCartDetails = async (req,res,next)=>{
    try {
        const cartId = parseInt(req.params.cartid);
        const productId = parseInt(req.params.productid);
        const cartDetails = await cartDetailModel.updateMany({
            where:{
                AND:[
                    {
                        cartId: cartId,
                    },{
                        productId: productId,  
                    },
                    {
                        quantity:{gt:1}
                    }
                ]
            },
            data:{
                quantity:{decrement:1}
            }
        });
        if(cartDetails == false){
            throw boom.badRequest();
        }

        res.status(200).json(cartDetails);
        
        } catch (error) {
            next(error)
        }
}
//Function delete product of a cart details
const deleteProductCartDetails = async (req,res,next)=>{
       try {
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
                res.status(200).json({deleteCount: 1});
            }
       } catch (error) {
           next(error);
       }
}

module.exports = {createUserCart,addProductCartDetails,findUserCartDetails, incrementQuantityCartDetails, decrementQuantityCartDetails, deleteProductCartDetails};