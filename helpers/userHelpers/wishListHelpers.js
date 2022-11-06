const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { PRODUCT_COLLECTION, ORDER_COLLECTION } = require('../../config/collections');
const { DeploymentList } = require('twilio/lib/rest/preview/deployed_devices/fleet/deployment');
//const { response } = require('express');
const express = require('express');
const Razorpay = require('razorpay')
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

    addToWishlist:(proId,userId)=>{
        let wProObj = {
            item: objectId(proId),
            quantity:1
        }
        return new Promise( async(resolve,reject) =>{
            let userWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
            if(userWishlist){
                let wProExist = userWishlist.products.findIndex(product => product.item == proId)
                if(wProExist != -1){
                    return
                }else{
                    db.get().collection(collection.WISHLIST_COLLECTION)
                    .updateOne({user:objectId(userId)},
                    {
                        $push:{products:wProObj}
                    }                    
                    ).then((response)=>{
                        resolve(response)
                    }) 
                }            
            }else{
                let wListObj={
                    user:objectId(userId),
                    products:[wProObj]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wListObj).then((response)=>{
                    resolve()
                })
            }
        })

    },
    getWishListProducts: (userId)=>{
        return new Promise ( async (resolve, reject)=>{
            let wishListItems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
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
            //console.log("999999999_",wishListItems)
             resolve(wishListItems)
            ///resolve(cartItems)
        })
    },
    wishListCount:(userId)=>{
        return new Promise( async(resolve,reject) =>{
            let wCount=0;
            let wishList = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
            if(wishList){
                wCount = wishList.products.length;
            }
            else{
                wCount=0;
            }
            resolve(wCount)
        })
    }

  }