var db= require('../../config/connection')
var collection=require('../../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
//const { get } = require('../app')
var objectId=require('mongodb').ObjectId

module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let response={}
                let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
                console.log("admin:",admin)
                if(admin){
                    bcrypt.compare(adminData.Password,admin.Password).then((status)=>{                    
                        if(status){
                            console.log("Login Success");
                            response.admin=admin
                            response.status=true
                            resolve(response)
                        }else{
                            console.log("Admin login failed")
                            resolve({status:false})
                        }
                    })
                }
            } catch (error) {
                next(error)
            }    
        })
    },

    verifyEmail:(adminEmail)=>{
        return new Promise (async(resolve,reject) =>{
            try {
                let response = await db.get().collection(collection.USER_COLLECTION).find({Email:adminEmail}).count()
                resolve(response)
            } catch (error) {
                next(error)
            }                     
        })
    },

    doSignup:(adminData)=>{       
        return new Promise(async(resolve,reject)=>{
            try {
                userData.Password=await bcrypt.hash(adminData.Password,10)
                db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((Data)=>{
                resolve(Data.insertedId)       
                })
            } catch (error) {
                next(error) 
            }            
      })
    },
    //---------------------------------UserManagement ---------------------------------------
    getAllUsers:() => {
        return new Promise( async (resolve,reject) =>{
            try {
                  let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
                  resolve(users)
            } catch (error) {
                  next(error)
            }            
        })
    },

    blockUser:(userId)=>{
        return new Promise((resolve,reject)=>{  
            try {
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{status: true}}).then((response) =>{
                    resolve(response)                
                })
            } catch (error) {
                next(error)
            }       
        })
    },

    unBlockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            try {
                db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{status: false}}).then((response) =>{
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }            
        })
    },  
    //---------------------------------CategoryManagement ---------------------------------------
    addCategory:(category_name)=>{
        return new Promise( (resolve,reject) => {
            try {
                db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category_name).then((response)=>{                
                    resolve(response)
                })
            } catch (error) {
                next(error)
            } 
        })
    },

    showCategory:() =>{
        return new Promise( async (resolve,reject) =>{
            try {
                let Category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()            
                resolve(Category) 
            } catch (error) {
                next(error) 
            }                           
        })
    },

    deleteCategory:(cateID)=>{
        return new Promise( (resolve,reject)=>{
            try {
                db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(cateID)}).then((response) =>{
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }            
        } )
    },

    addProduct:(product)=>{
        return new Promise ( (resolve, reject) =>{
            try {
                db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((response) =>{
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }            
        })
    },

 //---------------------------------ProductManagement ---------------------------------------
    getAllProducts:() => {
        return new Promise ( (resolve,reject) =>{
            try {
                let products = db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
                    resolve(products)
            } catch (error) {
                next(error)
            }
        })
    },

    deleteProduct:(productId)=>{
        return new Promise( (resolve, reject) => {
            try {
                db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id:objectId(productId)}).then((response)=>{
                    resolve(response)            
                })
            } catch (error) {
                next(error)
            }        
        })
    },

    getProductDetails:(proId)=>{
        return new Promise ( (resolve,reject) =>{
            try {
                db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                    resolve(product)            
                })
            } catch (error) {
                next(error)
            }        
        })
    },

    getCategoryName:(cateId)=>{
        return new Promise ((resolve,reject) =>{
            try {
                db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(cateId)}).then((category) => { 
                    resolve(category)
                })
            } catch (error) {
                next(error)
            }        
        })
    },

//---------------------------UPDATE Products -----------------------------
    updateProducts:(product)=>{
        return new Promise((resolve,reject) => {
            try {
                db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({_id:objectId(product.proId)},{
                    $set:{
                    ProductName : product.ProductName,
                    ProductID : product.ProductID,
                    ProductDetails : product.ProductDetails,
                    Price : product.Price,
                    CategoryID : product.CategoryID,
                    CategoryName:product.CategoryName,
                    Images : product.Images  
                }
                }).then((response) =>{
                    resolve()
                })
            } catch (error) {
                next(error)
            }       
        })
    },

    getOrderDetails:()=>{
        return new Promise((resolve,reject)=>{
            try {
                db.get().collection(collection.ORDER_COLLECTION).find().toArray().then((response)=>{            
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }         
        })
    },

    changeOrderStatus:(status,orderId)=>{
        return new Promise( (resolve,reject)=>{
            try {
                db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
                {
                    $set:{status: status}
                }).then((response) =>{            
                    resolve()
                })
            } catch (error) {
                next(error)
            }            
        })
    },

    addCoupon:(couponData)=>{
        return new Promise( (resolve, reject)=>{
            try {
                db.get().collection(collection.COUPON_COLLECTION).insertOne(couponData).then( (response)=>{
                    resolve()
                })
            } catch (error) {
                next(error)
            }        
        })
    },

    getCouponCollection:()=>{
        return new Promise( (resolve,reject) =>{
            try {
                db.get().collection(collection.COUPON_COLLECTION).find().toArray().then( (response)=>{
                    console.log("Coupon Data:", response)
                    resolve(response)
                })
            } catch (error) {
                next(error)
            }            
        })
    },

    deleteCoupon:(couponId)=>{
        return new Promise( (resolve,reject)=>{
            try {
                db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:objectId(couponId)}).then( ()=>{
                    resolve()
                })
            } catch (error) {
                next(error)
            }
        })
    }  

}