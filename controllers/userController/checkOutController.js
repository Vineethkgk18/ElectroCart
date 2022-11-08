const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers/userHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
const cartHelpers = require('../../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../../helpers/userHelpers/checkOutHelpers')

const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');

module.exports ={  
    getUserCheckOut:async(req,res) =>{
        try {
                let userId = req.session.user._id;
                let user = req.session.user;
                let coupon = await userHelpers.getCoupon()
                let Products = await cartHelpers.getCartProducts(userId)
                let wishListCount = await wishListHelpers.wishListCount(userId) 
                let totalPrice = await cartHelpers.getTotoalPrice(userId)
                let wProducts = await wishListHelpers.getWishListProducts(userId)
                let cartCount = await cartHelpers.getCartCount(userId)  
                let addressInfo = req.session.user;              
                let grantTotal = totalPrice;
                let discountAmount=0;
                res.render('userpages/checkOut',{users:true,valueOf,user,totalPrice,discountAmount,grantTotal,Products,wProducts,wishListCount,cartCount,addressInfo,coupon })
        } catch (error) {
                next(error)
        }
      },
    getBillingAddress:async(req,res) =>{
        try {
              let userId = req.session.user._id;
              let add = req.body.address
              let Products = await cartHelpers.getCartProducts(userId)
              let address = await userHelpers.getAddressById(add,userId)
              res.json({address})
        } catch (error) {
              next(error)
        }        
    },
    postBillingAddress:async(req,res) =>{
      try {
            let userId = req.session.user._id;
            let add = req.body.address
            let Products = await cartHelpers.getCartProducts(userId)
            let address = await userHelpers.getAddressById(add,userId)
            res.json({address})
      } catch (error) {
            next(error)
      }      
    },

    postConfirmOrder:async(req,res)=>{
        try {
              let userId = req.session.user._id;
              let totalPrice = await cartHelpers.getTotoalPrice(userId)
              let cartProducts = await cartHelpers.getCartProducts(userId)
              let orderId = await userHelpers.placeOrder(req.body,userId,totalPrice,cartProducts)          
                  if(req.body.paymentMethod ==='COD'){
                    res.json({codSuccess:true})
                  }
                  else{
                  let response = await userHelpers.generatedRazorPay(orderId,totalPrice)
                      res.json({response})           
                  }   
        } catch (error) {
          next(error)
        }    
    },
    getOrderSuccess: async(req,res)=>{
          try {
            res.render('userpages/userOrderSuccess')
          } catch (error) {
            next(error)
          }
    },
    postVerifyPayment:(req,res)=>{
  
          userHelpers.verifyPaymentResult(req.body).then(()=>{    
          userHelpers.changePaymentStatus(req.body['order[response][receipt]']).then( ()=>{
          console.log("Payment success")
            res.json({status:true})
          })
        }).catch((err)=>{
          console.log(err)
          res.json({status:false,errMsg:''})
        })
    },
    postApplyCoupon:async(req,res)=>{
      try {
            let userId = req.session.user._id;
            let couponDetails= req.body;   
            let totalPrice = await cartHelpers.getTotoalPrice(userId)
            let couponData = await checkOutHelpers.checkCouponValidity(couponDetails.couponId,userId)
            req.session.couponData = couponData; 
            req.session.totalAmount = req.body.totalPrice;
            couponData.totalPrice=totalPrice;  
            /**
             * 
             * couponData contains all the value related to the validity of the 
             * coupon 
             * if coupon is expired it shows expiry:true
             * if coupon is valied it returns the coupon data
             * 
             */
            res.json({couponData}) 
          } catch (error) {
            next(error)
          }      
    }
    
    
}