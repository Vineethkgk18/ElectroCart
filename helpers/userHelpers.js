const db= require('../config/connection')
const collection=require('../config/collections')
const bcrypt = require('bcrypt')
const { PRODUCT_COLLECTION } = require('../config/collections');
const { DeploymentList } = require('twilio/lib/rest/preview/deployed_devices/fleet/deployment');
const { response } = require('express');
require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const objectId=require('mongodb').ObjectId

module.exports={
    verifyEmail:(userEmail)=>{
        return new Promise ((resolve,reject) =>{
            db.get().collection(collection.USER_COLLECTION).find({Email:userEmail}).count().then((response) =>{
                console.log("Email_count:", response)    
                resolve(response)
            })           
        })
    },
    doSignup:(userData)=>{
       // console.log("user Data before bcrypt:",userData);//----new edit
        console.log(userData)
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
    },
    getProducts:()=>{
        return new Promise ( (resolve,reject) =>{
            db.get().collection(collection.PRODUCT_COLLECTION).find().toArray().then((products)=>{
                resolve(products)
            })
        })
    },
    getCategory:()=>{
        return new Promise ( (resolve,reject) =>{
            db.get().collection(collection.CATEGORY_COLLECTION).find().toArray().then((category)=>{
                resolve(category)
            })
        })
    },
    getFilterProduct:(cateID) =>{
       // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB")
        //console.log("cateID:",cateID)
        return new Promise ( (resolve, reject) =>{            
            db.get().collection(collection.PRODUCT_COLLECTION).find({CategoryID:cateID}).toArray().then((response)=>{
                //console.log("response:",response)
                resolve(response)
            })       
        })
    },
    getFilterCategory:(cateID) => {
        return new Promise( (resolve, reject) => {
            db.get().collection(collection.CATEGORY_COLLECTION).find({_id:objectId(cateID)}).toArray().then((response) =>{
                //console.log("response:",response)
                resolve(response)
            })
        })

    },
    getProductById:(productId) => {
            return new Promise ( (resolve, reject) => {
                db.get().collection(collection.PRODUCT_COLLECTION).find({_id:objectId(productId)}).toArray().then((response)=>{
                    //console.log("response:",response)
                    resolve(response)
                })
            })
    },
    addToCart: (proId,userId)=>{
                    console.log("1111111111")
        let proObj = {
            item: objectId(proId),
            quantity:1
        }
       return new Promise (async (resolve,reject) =>{
        console.log("2222222222");
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)}) 
        // .then((resopnse)=>{
            console.log("333333333333__userCart",userCart);
            console.log("proObj:",proObj)
           
        if(userCart)
        {
                let proExist = userCart.products.findIndex(product => product.item == proId)
                console.log("AAAAAAAAAAAA:",proExist)
                
                if(proExist != -1){

                    console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTT")
                        db.get().collection(collection.CART_COLLECTION)
                        .updateOne({user:objectId(userId),'products.item':objectId(proId)},
                        {
                            $inc:{'products.$.quantity':1}
                        }
                        ).then(()=>{
                            resolve()
                        })
                    console.log(" WWWWWWWWWWWWWWWWWWWWWWWWWWWW")
                }else{
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({user:objectId(userId)},
                    {
                        $push:{products: proObj}
                     }
                    ).then((response) =>{
                    resolve(response)
                    })
                }
        }else{
                let cartObj = {
                    user: objectId(userId),
                    products:[proObj]                    
                }

                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    console.log("QQQQQQQQQQQQQQQQQ_____response", response)
                    //resolve(response)
                    resolve()
                })
            }
       })
       console.log("SSSSSSSSSSSSSSSSSSSSSSSSSS")
    },
    getCartProducts: (userId)=>{
        return new Promise ( async (resolve, reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'                    
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                 },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }                            
            ]).toArray()
            console.log("999999999_",cartItems)
             resolve(cartItems)
            ///resolve(cartItems)
        })
    },
    getCartCount:(userId) =>{
        return new Promise ( async(resolve,reject)=>{
            let count=0;
           // console.log("XXXXXXXXXXXXXXXXXXXXXXX___getCartCount");
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
           // console.log("yyyyyyyyy_cart_length",cart)
            if(cart){
                count= cart.products.length
            }
            else{
                count=0;
            }
           // console.log("count:",count)
            resolve(count)
        })
    },
    //changeProductQuantity:({cartId,proId,count})=>{
     changeProductQuantity:(cartDetails)=>{
        quantity= parseInt(cartDetails.quantity)
        count = parseInt(cartDetails.count)
        console.log("cartDetails.count00000",quantity)
        return new Promise( (resolve, reject) =>{
            if(cartDetails.count==-1 && cartDetails.quantity==1){
                db.get().collection(collection.CART_COLLECTION)
                .updateOne({_id:objectId(cartDetails.cart)},
                {
                    $pull:{products:{item:objectId(cartDetails.product)}}                    
                }
                ).then((response)=>{
                    resolve({removeProduct:true})
                })
            }else{
                db.get().collection(collection.CART_COLLECTION)
                        .updateOne({_id:objectId(cartDetails.cart),'products.item':objectId(cartDetails.product)},
                            {
                                $inc:{'products.$.quantity':count}
                            }                            
                        ).then((response)=>{
                            resolve({status:true}) 
                        })
            }          
        })
    },
    getTotoalPrice:(userId)=>{
        console.log("UserId",userId)
        return new Promise ( async (resolve, reject)=>{
            let total = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
    
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'                    
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity',{$toInt:'$product.Price'}]}}
                    }
                }   
            ]).toArray()
            if (total.length == 0) {
                resolve(total)
            } else {
                resolve(total[0].total)
    
            }
            // console.log("total:", total[0].total)
            // resolve(total[0].total)
        })
    },
    
    addToWishlist:(proId,userId)=>{
        let wProObj = {
            item: objectId(proId),
            quantity:1
        }
        // let wProObj = {
        //     item: objectId(proId),
        //    quantity:1
        // }
        return new Promise( async(resolve,reject) =>{
            let userWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
            if(userWishlist){
                let wProExist = userWishlist.products.findIndex(product => product.item == proId)
                if(wProExist != -1){
                    return
                }else{
                    db.get().collection(collection.WISHLIST_COLLECTION)
                    .updateOne({user:objectId(userId)},
                    {
                        $push:{products:wProObj}
                    }                    
                    ).then((response)=>{
                        resolve(response)
                    }) 
                }            
            }else{
                let wListObj={
                    user:objectId(userId),
                    products:[wProObj]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wListObj).then((response)=>{
                    resolve()
                })
            }
        })

    },
    getWishListProducts: (userId)=>{
        return new Promise ( async (resolve, reject)=>{
            let wishListItems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project:{
                        item:'$products.item',
                        quantity:'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from:collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                        }
                },
                {
                    $project:{
                        item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                    }
                }    
                                       
            ]).toArray()
            console.log("999999999_",wishListItems)
             resolve(wishListItems)
            ///resolve(cartItems)
        })
    },
    wishListCount:(userId)=>{
        return new Promise( async(resolve,reject) =>{
            let wCount=0;
            let wishList = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({user:objectId(userId)})
            if(wishList){
                wCount = wishList.products.length;
            }
            else{
                wCount=0;
            }
            resolve(wCount)
        })
    }
}


  