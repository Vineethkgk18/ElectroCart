const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
//const { get } = require('../../app')
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network')
var objectId=require('mongodb').ObjectId

module.exports={
    getUsersCount:()=>{
        return new Promise( async (resolve,reject)=>{
           // let userCount = await db.get().collection(collection.USER_COLLECTION).find().count()
            
            db.get().collection(collection.USER_COLLECTION).countDocuments().then( (userCount)=>{
                resolve(userCount)
            })
                // resolve(userCount)
            // try {
            //     let userCount = await db.get().collection(collection.USER_COLLECTION).find().count()
            //     resolve(userCount)
            // } catch (error) {
            //    // next(error)
            // }
        })
    },
    getOrdersCount:()=>{
        return new Promise( async (resolve,reject)=>{
            //let orderCount = await db.get().collection(collection.ORDER_COLLECTION).find().count()
            // let orderCount = await 
            db.get().collection(collection.ORDER_COLLECTION).countDocuments().then( (orderCount)=>{
                resolve(orderCount)
            })
                 
            // try {
            //     let orderCount = await db.get().collection(collection.ORDER_COLLECTION).find().count()
            //     resolve(orderCount)
            // } catch (error) {
            //     //next(error)
            // }
        })
    },
    getNumberOfOrderDelivered:()=>{ 
        return new Promise( async (resolve,reject)=>{

            //let deliveredCount = await db.get().collection(collection.ORDER_COLLECTION).find({status:"Delivered"}).count()
            //let deliveredCount = await db.get().collection(collection.ORDER_COLLECTION).find({status:"Delivered"}).countDocuments()
            ///let deliveredCount = await db.get().collection(collection.ORDER_COLLECTION).countDocuments({status:"Delivered"})
            db.get().collection(collection.ORDER_COLLECTION).countDocuments({status:"Delivered"}).then( (deliveredCount)=>{
                resolve(deliveredCount)
            })  
            
            // try {
            //     let deliveredCount = await db.get().collection(collection.ORDER_COLLECTION).find({status:"Delivered"}).count()
            //     resolve(deliveredCount)
            // } catch (error) {
            //     //next(error)
            // }
            
        })
    },
    getCodCount:()=>{
        return new Promise( async(resolve,reject)=>{

           // let codCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"COD"}).count()
           // let codCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"COD"}).countDocuments()
           //let codCount = await db.get().collection(collection.ORDER_COLLECTION).countDocuments({paymentMethod:"COD"})
           db.get().collection(collection.ORDER_COLLECTION).countDocuments({paymentMethod:"COD"}).then( (codCount)=>{
            resolve(codCount)
           })
           
            // try {
            //     let codCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"COD"}).count()
            //     resolve(codCount)
            // } catch (error) {              
            // }
        })
    },
    getOnlineCount: ()=>{
         return new Promise( async (resolve,reject) =>{

            //let onlineCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"Online Payment"}).count()
            //let onlineCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"Online Payment"}).countDocuments()
           // let onlineCount = await db.get().collection(collection.ORDER_COLLECTION).countDocuments({paymentMethod:"Online Payment"}) 
           db.get().collection(collection.ORDER_COLLECTION).countDocuments({paymentMethod:"Online Payment"}).then( (onlineCount)=>{
            resolve(onlineCount)
           }) 
           
            // try {
            //     let onlineCount = await db.get().collection(collections.ORDER_COLLECTION).find({paymentMethod:"Online Payment"}).count()
            //     resolve(onlineCount)
            // } catch (error) {
            //    //next(error) 
            // }
         })
    },
    getTotalSalesMonthly:()=>{
        return new Promise( (resolve,reject)=>{
            try {
                
                db.get().collection(collection.ORDER_COLLECTION).aggregate([
                    {
                        $project:{
                            date: {
                                   $dateFromString: {
                                      dateString: '$date'
                                   }
                                },totalAmount:1
                          },
                          $group:{
                            _id: {
                                month: { $month: "$date" },
                                year: { $year: "$date" } 
                            },
                            total: { $sum: "$totalAmount" },
                       
                         }                       
                                        
                    }
                ]).then( (response)=>{
                    console.log(" Monthly slaes ", response)
                    resolve(response)
                })
            } catch (error) {
                
            }
        })
    },
    getTotalMonthly:()=>{
        return new Promise( (resolve,reject)=>{

            try {
                db.get().collection(collection.ORDER_COLLECTION).aggregate([ 
                    { 
                            $project: { date: { $toDate: "$date" } ,totalAmount:1 }                     
                            
                    }
                    ]).then( (response) =>{
                        console.log(response)
                        resolve(response)
                    })
            } catch (error) {
                
            }
        })


    }

    
}