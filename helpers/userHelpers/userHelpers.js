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

    addUserAddress:(userId,address)=>{
        return new Promise((resolve,reject)=>{
            try {
                function create_random_id(sting_length) {
                    var randomString = '';
                    var numbers = '123456789'
                    for (var i, i = 0; i < sting_length; i++) {
                        randomString += numbers.charAt(Math.floor(Math.random() * numbers.length))
                    }
                    addId = "AD" + randomString
                return(addId)
                }
                address.addId = create_random_id(10)
                db.get().collection(collection.USER_COLLECTION)
                .updateOne({_id:objectId(userId)},
                {   $push:{Address:address}
                },
                {   $set:{current_address: address.addId }
                }
                ).then((response)=>{
                    console.log("BBBBBB__response", response)
                    resolve()
                })
            } catch (error) {
                next(error)
            }                
        })
    },
    
    getAddressById:(add,userId)=>{
        return new Promise(async(resolve,reject) =>{
            try {
                let address =  await db.get().collection(collection.USER_COLLECTION).aggregate([
                    {
                        $match:{_id:objectId(userId)}
                    },
                    {
                        $unwind:'$Address'
                    },
                    {
                        $match:{'Address.addId':add}
                    }
                ]).toArray()            
                resolve(address[0].Address)     
            } catch (error) {
                next(error)
            }           
        })
    },

    placeOrder:(order,userId,total,cartProducts)=>{
        return new Promise( (resolve,reject)=>{
            try {
                let status = order.paymentMethod==='COD'?'placed':'pending'
                let orderObj={
                    deliveryDetails:{
                    Mobile:order.mobile,
                    Address:order.Address,
                    Pincode:order.Pincode
                    },
                    userId:objectId(userId),
                    paymentMethod:order.paymentMethod,
                    totalAmount:total,
                    products:cartProducts,
                    status:status,
                    date: new Date().toDateString()
                }
                db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response)=>{
                    db.get().collection(collection.CART_COLLECTION).deleteOne({user:objectId(userId)})
                    console.log("success")    
                    resolve(response.insertedId)   
                })
            } catch (error) {
                next(error)
            }
        })
    }, 

    generatedRazorPay:(orderId,total) =>{
        return new Promise( (resolve,reject)=>{
            try{
                var options = {
                    amount: total*100,  // amount in the smallest currency unit
                    currency: "INR",
                    receipt: ""+orderId
                };
                instance.orders.create(options, function(err, order) {
                    if(err)
                    {
                        console.log("err",err)
                    }
                    else{
                    resolve(order)
                    }
                });
            }catch (error) {
                next(error)
            }
        })
    },

    verifyPaymentResult:(paymentDetails)=>{
        return new Promise( (resolve,reject) =>{
            try{
                const crypto = require('crypto');                
                let hmac = crypto.createHmac('sha256', YOUR_KEY_SECRET)
                hmac.update(paymentDetails['payment[razorpay_order_id]']+'|'+paymentDetails['payment[razorpay_payment_id]']);
                hmac=hmac.digest('hex')
                if(hmac==paymentDetails['payment[razorpay_signature]']){                    
                    resolve()
                }else{
                    reject()
                }
            }catch (error) {
                next(error)
            }
        })
    },
    changePaymentStatus:(orderId)=>{
        return new Promise( (resolve,reject)=>{
            try {
                db.get().collection(collection.ORDER_COLLECTION)
                .updateOne({_id:objectId(orderId)},
                {
                    $set: {
                        status:'placed'
                    }
                }
                ).then( ()=>{
                    resolve()
                })
            } catch (error) {
                next(error)
            }    
            
        })
    },

    getOrder:(userId)=>{
        return new Promise( (resolve,reject)=>{ 
            try {
                db.get().collection(collection.ORDER_COLLECTION).find({userId:objectId(userId)}).toArray().then( (response)=>{
                    resolve(response)
                }) 
            } catch (error) {
                next(error)
            }  
        })
    },
    getOrderProducts: (userId,orderId)=>{
        return new Promise (async(resolve, reject)=>{
            try {
                let orderItem = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $match:{_id:objectId(orderId)}
                    }
                ]).toArray()
                resolve(orderItem)
            } catch (error) {
                next(error)
            }            
        })
    },

    changeOrderStatus:(orderId)=>{
        return new Promise( async(resolve,reject) =>{
            try {                   
                    db.get().collection(collection.ORDER_COLLECTION)
                    .updateOne({_id:orderId},
                    {
                        $set: {
                                status:"cancelled"
                            }
                    }                
                    ).then( ()=>{
                        console.log("successsssssss")
                        resolve()
                    })
            } catch (error) {
                next(error)      
            }
        })
    },

    getCoupon:()=>{
        return new Promise( (resolve,reject)=>{
            try {
                db.get().collection(collection.COUPON_COLLECTION).find().toArray().then( (response)=>{
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }
            
        })
    }

}

    