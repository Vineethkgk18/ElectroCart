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

    verifyEmail:(userEmail)=>{
        return new Promise ((resolve,reject) =>{
            db.get().collection(collection.USER_COLLECTION).find({Email:userEmail}).count().then((response) =>{
              //  console.log("Email_count:", response)    
                resolve(response)
            })           
        })
    },

    doSignup:(userData)=>{       
        return new Promise(async(resolve,reject)=>{
           userData.Password=await bcrypt.hash(userData.Password,10)
           db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((Data)=>{
            resolve(Data.insertedId)
            // try {
            //     const Data = await db.get().collection(collection.USER_COLLECTION).insertOne(userData)
            //         console.log(Data)
            //         resolve(Data.insertedId)
            // } catch (error) {
            //     console.log(error);
            // }            
        })
    })
    },
    doLogin:(userData) =>{
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false            
            //console.log(userData)
            let response={}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})            
           // console.log("user:",user)
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                   // console.log(`status: ${status}`)
                    if(status){
                        //console.log("login Success");
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                      //  console.log("login failed username or password does't match");
                        resolve({status:false})
                    }
                })
            }else{
                //console.log("login failed  User doesn't Exist ");
                resolve({status:false})
            }
        })
    }







  }