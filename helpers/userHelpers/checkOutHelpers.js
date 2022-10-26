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

    checkCouponValidity:(couponId,userId)=>{
      // if(db.get().collection(collection.COUPON_COLLECTION).updateOne()
           return new Promise( async (resolve, reject) =>{
            try{
              let couponDetails = await db.get().collection(collection.COUPON_COLLECTION).findOne({_id:objectId(couponId)})
              console.log("couponDetails:",couponDetails)
              
              if(couponDetails){

                let date = new Date();
                console.log("date:",date)
                let expiryDate = new Date(couponDetails.ExpiryDate)
                //let str = date.toJSON().slice(0, 10);
                console.log(expiryDate, 'expiryDate');
                //console.log(str, 'dateeeeee');
                if(date>expiryDate){
                  resolve({expiry:true})
                }else{

                  let user = await db.get().collection(collection.COUPON_COLLECTION)
                  .findOne({_id:objectId(couponId), users:{ $in: [objectId(userId)]}});
                  console.log(" check user in coupon used field ")

                  if(user){
                    console.log(" user used coupon ")
                    resolve({couponUsed:true})
                  }else{
                    resolve(couponDetails)
                  }
                }
              }else{
                console.log("Coupon doesn't exist ");
                resolve({unavailable: true})
              }


            }catch{
              console.log(error)
              reject(error)
            }
          })
   }


    
  }


