const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { PRODUCT_COLLECTION, ORDER_COLLECTION } = require('../../config/collections');
const { DeploymentList } = require('twilio/lib/rest/preview/deployed_devices/fleet/deployment');
const { response } = require('express');
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

    getProducts:()=>{
        return new Promise ( (resolve,reject) =>{
            db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((products)=>{
                resolve(products)
            })
        })
    },
    getFilterProduct:(cateID) =>{       
        return new Promise ( (resolve, reject) =>{            
            db.get().collection(collection.PRODUCT_COLLECTION).find({CategoryID:cateID}).toArray().then((response)=>{
                resolve(response)
            })       
        })
    },
    getProductById:(productId) => {
        return new Promise ( (resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).find({_id:objectId(productId)}).toArray().then((response)=>{
                resolve(response)
            })
        })
}


 }