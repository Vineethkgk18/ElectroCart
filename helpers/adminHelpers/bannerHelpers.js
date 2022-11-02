const db= require('../../config/connection')
const collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { get } = require('../../app')
var objectId=require('mongodb').ObjectId

module.exports={
    addbanner:(banner)=>{
        return new Promise( (resolve,reject)=>{
                db.get().collection(collection.BANNER_COLLECTION).insertOne(banner).then((data)=>{
                    //resolve(data.insertedId)
                    resolve(data)
                })
        })
    },
    //viewBanner:(banner)
    viewBanner:()=>{
        return new Promise(async(resolve, reject) => {
        try {
                let banner = await db.get().collection(collection.BANNER_COLLECTION).find().toArray()
                 resolve(banner)
        } catch (error) {
           // reject(error)
        }
    })
    },

    deleteBanner: (bannerId)=>{
        return new Promise(async (resolve, reject) => {
        try {
                db.get().collection(collections.BANNER_COLLECTION).deleteOne({ _id: objectId(bannerId) }).then((response) => {
                  resolve(response)
          
          
                })
            
        } catch (error) {
           // reject(error)
        }
    })

    }

}