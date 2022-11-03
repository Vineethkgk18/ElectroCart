const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
const cartHelpers = require('../../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../../helpers/userHelpers/checkOutHelpers')

const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');

module.exports ={  
    getUserCheckOut:async(req,res) =>{
        let userId = req.session.user._id;
        let user = req.session.user;
        let coupon = await userHelpers.getCoupon()
        let Products = await cartHelpers.getCartProducts(userId)
        let wishListCount = await wishListHelpers.wishListCount(userId) 
        let totalPrice = await cartHelpers.getTotoalPrice(userId)
        let wProducts = await wishListHelpers.getWishListProducts(userId)
        let cartCount = await cartHelpers.getCartCount(userId)  
        
        let addressInfo = req.session.user;
        console.log("00000000000000000000000000000", Products);
        //console.log("req.session.user._id",req.session.user)
        let grantTotal = totalPrice;
        let discountAmount=0;
        res.render('userpages/checkOut',{users:true,valueOf,user,totalPrice,discountAmount,grantTotal,Products,wProducts,wishListCount,cartCount,addressInfo,coupon })
      },
      getBillingAddress:async(req,res) =>{
        let userId = req.session.user._id;
        let add = req.body.address
        let Products = await cartHelpers.getCartProducts(userId)
        let address = await userHelpers.getAddressById(add,userId)
         res.json({address})
      },
      getConfirmOrder:async(req,res)=>{
        //console.log("XXXXXXXreq.body", req.body)
        let userId = req.session.user._id;
        let totalPrice = await cartHelpers.getTotoalPrice(userId)
        let cartProducts = await cartHelpers.getCartProducts(userId)
        userHelpers.placeOrder(req.body,userId,totalPrice,cartProducts).then((orderId)=>{           
          if(req.body.paymentMethod ==='COD'){
            res.json({codSuccess:true})
          }
          else{
            userHelpers.generatedRazorPay(orderId,totalPrice).then((response)=>{
              res.json({response})
           })
          }   
        })
      },
      getOrderSuccess: async(req,res)=>{

        res.render('userpages/userOrderSuccess')//{users:true,orderSuccess:false})
      }



}