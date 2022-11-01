
var db= require('../config/connection')
var collection=require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { get } = require('../app')
var objectId=require('mongodb').ObjectId

module.exports={
    addbanner:(banner,callback)=>{
        try {
            db.get().collection(collections.BANNER_COLLECTION).insertOne(banner).then((data)=>{
                callback(data.insertedId)
            })
        } catch (error) {
           // reject(error)
        }
    },
    //viewBanner:(banner)
    viewBanner:()=>{
        return new Promise(async(resolve, reject) => {
        try {
                let banner = await db.get().collection(collections.BANNER_COLLECTION).find().toArray()
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