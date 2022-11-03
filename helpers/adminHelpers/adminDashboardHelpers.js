const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { get } = require('../../app')
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network')
var objectId=require('mongodb').ObjectId

module.exports={
    getUsersCount:()=>{
        return new Promise( async (resolve,reject)=>{
            try {
                let userCount = await db.get().collection(collection.USER_COLLECTION).find().count()
                resolve(userCount)
            } catch (error) {
                next(error)
            }
        })
    },
    getOrdersCount:()=>{
        return new Promise( async (resolve,reject)=>{
            try {
                let orderCount = await db.get().collection(collection.ORDER_COLLECTION).find().count()
                resolve(orderCount)
            } catch (error) {
                next(error)
            }
        })
    },
    getNumberOfOrderDelivered:()=>{ 
        return new Promise( async (resolve,reject)=>{
            try {
                let deliveredCount = await db.get().collection(collection.ORDER_COLLECTION).find({status:"Delivered"}).count()
                resolve(deliveredCount)
            } catch (error) {
                next(error)
            }
            
        })
    },getCodCount:()=>{
        return new Promise( async(resolve,reject)=>{
            try {
                let codCount = await db.get().collection(collection.ORDER_COLLECTION).find({paymentMethod:"COD"}).count()
                resolve(codCount)
            } catch (error) {
                
            }
        })

    },
    getOnlineCount: ()=>{
         return new Promise( async (resolve,reject) =>{
            try {
                let onlineCount = await db.get().collection(collections.ORDER_COLLECTION).find({paymentMethod:"Online Payment"}).count()
                resolve(onlineCount)
            } catch (error) {
               next(error) 
            }
         })
    }
    
}