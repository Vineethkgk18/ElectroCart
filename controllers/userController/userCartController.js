const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers/userHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
// const cartHelpers = require('../../helpers/userHelpers/categoryHelpers')
const cartHelpers = require('../../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../../helpers/userHelpers/checkOutHelpers')

const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');

module.exports ={
    getAddToCart: async (req,res)=>{
          try {
                let userId = req.session.user._id;
                let proId = req.params.id;
                let userCart =  await cartHelpers.addToCart(proId,userId)
                res.json({status:true})
          } catch (error) {
                next(error)
          }     
    },

    getViewCart: async (req,res)=>{
        /*
        This function show the cart page
        
        */ 
       try {
            let userId = req.session.user._id;
            let user = req.session.user;
            let Products = await cartHelpers.getCartProducts(userId)
            let totalPrice = await cartHelpers.getTotoalPrice(userId)
            let wProducts = await wishListHelpers.getWishListProducts(userId)
            let cartCount = await cartHelpers.getCartCount(userId) 
            let wishListCount = await wishListHelpers.wishListCount(userId)       
            res.render('userpages/userShoppingCart',{Products,users:true,orderSuccess:true,user,totalPrice,wProducts,cartCount,wishListCount})
       } catch (error) {
            next(error)
       }   
    },
    postChangeProductQuantity:(req,res,next) =>{
         try {
              cartHelpers.changeProductQuantity(req.body).then(async(response)=>{
                response.total = await cartHelpers.getTotoalPrice(req.body.user)
                res.json(response)
              })
         } catch (error) {
              next(error)
         }          
    }
   
}