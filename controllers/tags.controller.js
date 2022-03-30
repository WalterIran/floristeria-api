const boom = require('@hapi/boom');
const prisma = require('../config/db');
const tagsModel = prisma.tag;

const findAllTags = async (req,res,next) =>{
    try {
        const tag = await tagsModel.findMany();
        res.status(200).json(tag);
    } catch (error) {
        console.log(error)
        next(error);
    }
}

const updateTag = async (req, res, next) => {
    try{
        const id = parseInt(req.params.tagId);
        const changes = req.body;
        const Tag = await tagsModel.update({
            where: {
                tagId: id
            },
            data: {
                ...changes,
            }
        });
        
        if(!Tag){
           throw boom.notFound();
        }
        
        res.status(200).json({
            status: 'ok',
            result: Tag
        });
    } catch(error){
        next(error);
    }
   }

   //Create Tags
const createTag = async (req, res, next) => {
    try {
        const { tagName , tagDescription, discount } = req.body;

        const data = {
            tagName,
            tagDescription,
            discount,
            discountExpirationDate: new Date()
        }

        const Tag = await tagsModel.create({
            data
        });

        res.status(200).json({status: 'ok', Tag});
        }catch (error) {
        console.error(error);
        next(error);
    }
}

const getTopSoldTags = async (req, res, next) => {
    try {
        const tags = await prisma.$queryRaw`
            SELECT 
            t.tag_name,
            count(bd.bill_id) as 'sells'
            FROM tag as t
            inner join product_tag as pt on pt.tag_id = t.tag_id
            inner join product as p on p.product_id = pt.product_id
            inner join bill_detail as bd on bd.product_id = p.product_id
            group by t.tag_name
            order by sells desc
            LIMIT 5;
        `;
        res.status(200).json({status: 'ok', tags});
    } catch (error) {
        next(error);
    }
}

module.exports = {findAllTags, updateTag, createTag, getTopSoldTags};