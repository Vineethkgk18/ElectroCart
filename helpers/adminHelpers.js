var db= require('../config/connection')
var collection=require('../config/collections')
const bcrypt = require('bcrypt')
const { response } = require('express')
const { get } = require('../app')
var objectId=require('mongodb').ObjectId

module.exports={
    doLogin:(adminData)=>{
        return new Promise(async(resolve,reject)=>{
            // console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZZZ")
            console.log(adminData)
            let response={}
            let admin= await db.get().collection(collection.ADMIN_COLLECTION).findOne({Email:adminData.Email})
            console.log("admin:",admin)
            if(admin){
                bcrypt.compare(adminData.Password,admin.Password).then((status)=>{
                    console.log(`admin login status ${status}`)
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
        })
    },
    verifyEmail:(adminEmail)=>{
        return new Promise ((resolve,reject) =>{
            db.get().collection(collection.USER_COLLECTION).find({Email:adminEmail}).count().then((response) =>{
              //  console.log("Email_count:", response)    
                resolve(response)
            })           
        })
    },
    doSignup:(adminData)=>{       
        return new Promise(async(resolve,reject)=>{
            
           userData.Password=await bcrypt.hash(adminData.Password,10)
           db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((Data)=>{
            resolve(Data.insertedId)
                
        })
      })
    },
    //---------------------------------UserManagement ---------------------------------------
    getAllUsers:() => {
        return new Promise( async (resolve,reject) =>{
            //db.get().collection(collection.USER_COLLECTION).updateOne()
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    blockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            console.log(" admiHelper block user")
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{status: true}}).then((response) =>{
                resolve(response)
                console.log("Resolved")
            })
        })
    },
    
    unBlockUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            console.log(" XXXXXXXXXXXXXXXXXXXXXXXXXXX  ")
            db.get().collection(collection.USER_COLLECTION).updateOne({_id:objectId(userId)},{$set:{status: false}}).then((response) =>{
                resolve(response)
            })
        })
    },  
    //---------------------------------CategoryManagement ---------------------------------------
    addCategory:(category_name)=>{
        return new Promise( (resolve,reject) => {
            //let category = 
            db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category_name).then((response)=>{
                console.log(" category name added to database");
                resolve(response)
            })
        })
    },
    showCategory:() =>{
        return new Promise( async (resolve,reject) =>{
           // console.log("show category")
            let Category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            //console.log("show category")
                resolve(Category)
                //console.log("show category")
        })
    },
    deleteCategory:(cateID)=>{
        console.log("BBBBBBBBBBBBBBBBBBBBBBB",cateID)
        return new Promise( (resolve,reject)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(cateID)}).then((response) =>{
                resolve(response)
            })
        } )
    },
    addProduct:(product)=>{
        return new Promise ( (resolve, reject) =>{
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((response) =>{
                resolve(response)
            })
        })
    },
 //---------------------------------ProductManagement ---------------------------------------
 getAllProducts:() => {
    return new Promise ( (resolve,reject) =>{
        let products = db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
        resolve(products)
    })
},
deleteProduct:(productId)=>{
    return new Promise( (resolve, reject) => {
        // console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id:objectId(productId)}).then((response)=>{
            resolve(response)
            console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX")
        })
    })
},
getProductDetails:(proId)=>{
    return new Promise ( (resolve,reject) =>{
        db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
            resolve(product)
            console.log("product:",product)
        })
    })
},
getCategoryName:(cateId)=>{
    return new Promise ((resolve,reject) =>{
        db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(cateId)}).then((category) => { 
            resolve(category)
        })
        })
    },
//---------------------------UPDATE Products -----------------------------
updateProducts:(product)=>{
    return new Promise((resolve,reject) => {
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
    })

},
getOrderDetails:()=>{
    return new Promise((resolve,reject)=>{
         db.get().collection(collection.ORDER_COLLECTION).find().toArray().then((response)=>{
            //console.log("XcxcxcXcX:",response)
            resolve(response)
         })
    })
},
changeOrderStatus:(status,orderId)=>{
    console.log("ZZZZZZZZ____status", status)
    return new Promise( (resolve,reject)=>{
        db.get().collection(collection.ORDER_COLLECTION).updateOne({_id:objectId(orderId)},
        {
            $set:{status: status}
        }).then((response) =>{
            //console.log("update.response:",response)
            resolve()
     })
    })
},
addCoupon:(couponData)=>{
    return new Promise( (resolve, reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).insertOne(couponData).then( (response)=>{
            //console.log("GGGGGGGGG_response:", response)
            resolve()
        })
    })
},
getCouponCollection:()=>{
    return new Promise( (resolve,reject) =>{
        db.get().collection(collection.COUPON_COLLECTION).find().toArray().then( (response)=>{
            console.log("Coupon Data:", response)
            resolve(response)
        })
    })
},
deleteCoupon:(couponId)=>{
    return new Promise( (resolve,reject)=>{
        db.get().collection(collection.COUPON_COLLECTION).deleteOne({_id:objectId(couponId)}).then( ()=>{
            resolve()
        })
    })

}

    
}