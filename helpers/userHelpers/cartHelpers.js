const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { PRODUCT_COLLECTION, ORDER_COLLECTION } = require('../../config/collections');
const { DeploymentList } = require('twilio/lib/rest/preview/deployed_devices/fleet/deployment');
//const { response } = require('express');
const express = require('express');
const Razorpay = require('razorpay');
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken=process.env.TWILIO_AUTH_TOKEN
const YOUR_KEY_ID=process.env.RAZOR_KEY_ID
const YOUR_KEY_SECRET=process.env.RAZOR_KEY_SECRET
const client = require('twilio')(accountSid, authToken);
const objectId=require('mongodb').ObjectId
var instance = new Razorpay({
    key_id:YOUR_KEY_ID,
    key_secret:YOUR_KEY_SECRET
  });

module.exports={

    addToCart: (proId,userId)=>{ 

        try {
            let proObj = {
                item: objectId(proId),
                quantity:1
            }
           return new Promise (async (resolve,reject) =>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})        
            if(userCart)
            {
                    let proExist = userCart.products.findIndex(product => product.item == proId)
                    if(proExist != -1){
                            db.get().collection(collection.CART_COLLECTION)
                            .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                            {
                                $inc:{'products.$.quantity':1}
                            }
                            ).then(()=>{
                                resolve()
                            })
                    }else{
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({user:objectId(userId)},
                        {
                            $push:{products: proObj}
                         }
                        ).then((response) =>{
                        resolve(response)
                        })
                    }
            }else{
                    let cartObj = {
                        user: objectId(userId),
                        products:[proObj]                    
                    }
    
                    db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                        resolve()
                    })
                }
           })
        } catch (error) {
            next(error)
        }


    },


    getCartProducts: (userId)=>{
            return new Promise ( async (resolve, reject)=>{
                try {

                    let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                        {
                            $match:{user:objectId(userId)}
                        },
                        {
                            $unwind:'$products'
                        },
                        {
                            $project:{
                                item:'$products.item',
                                quantity:'$products.quantity'                    
                            }
                        },
                        {
                            $lookup:{
                                from:collection.PRODUCT_COLLECTION,
                                localField:'item',
                                foreignField:'_id',
                                as:'product'
                            }
                        },
                        {
                            $project:{
                                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                            }
                        }                            
                    ]).toArray()
                    resolve(cartItems)

                } catch (error) {
                    next(error)
                }                         
        })
    },
    getCartCount:(userId) =>{
        return new Promise ( async(resolve,reject)=>{

                try {
                    let count=0;
                let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
                if(cart){
                    count= cart.products.length
                }
                else{
                    count=0;
                }
                resolve(count)
                } catch (error) {
                    next(error)
                }
        })
    },
    changeProductQuantity:(cartDetails)=>{
        quantity= parseInt(cartDetails.quantity)
        count = parseInt(cartDetails.count)
        return new Promise( (resolve, reject) =>{

                try {
                    if(cartDetails.count==-1 && cartDetails.quantity==1){
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({_id:objectId(cartDetails.cart)},
                        {
                            $pull:{products:{item:objectId(cartDetails.product)}}                    
                        }
                        ).then((response)=>{
                            resolve({removeProduct:true})
                        })
                    }else{
                        db.get().collection(collection.CART_COLLECTION)
                                .updateOne({_id:objectId(cartDetails.cart),'products.item':objectId(cartDetails.product)},
                                    {
                                        $inc:{'products.$.quantity':count}
                                    }                            
                                ).then((response)=>{
                                    resolve({status:true}) 
                                })
                    }      
                } catch (error) {
                    next(error)
                }    
        })
    },
    getTotoalPrice:(userId)=>{
        return new Promise ( async (resolve, reject)=>{

                try {
                    let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                        {
                            $match:{user:objectId(userId)}
                        },
            
                        {
                            $unwind:'$products'
                        },
                        {
                            $project:{
                                item:'$products.item',
                                quantity:'$products.quantity'                    
                            }
                        },
                        {
                            $lookup:{
                                from:collection.PRODUCT_COLLECTION,
                                localField:'item',
                                foreignField:'_id',
                                as:'product'
                            }
                        },
                        {
                            $project:{
                                item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                            }
                        },
                        {
                            $group:{
                                _id:null,
                                total:{$sum:{$multiply:['$quantity',{$toInt:'$product.Price'}]}}
                            }
                        }   
                    ]).toArray()
                    if (total.length == 0) {
                        resolve(total)
                    } else {
                        resolve(total[0].total)
            
                    }
                } catch (error) {
                    next(error)
                }
        })
    }
}
 