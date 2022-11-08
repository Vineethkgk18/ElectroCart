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

module.exports ={ 
    getAddToWishList:async(req,res)=>{
        try {
              let proId = req.params.id;
              let userId = req.session.user._id;
              let userWishList =  await wishListHelpers.addToWishlist(proId,userId)        
              res.json({status:true})
        } catch (error) {
              next(error)
        }       
    },
    getViewWishList:async(req,res)=>{
      try {
            let userId = req.session.user._id;
            let user = req.session.user;
            let wProducts = await wishListHelpers.getWishListProducts(userId)
            let cartCount = await cartHelpers.getCartCount(userId)        
            res.render('userpages/userWishlist',{wProducts,cartCount,users:true,orderSuccess:true,user})
      } catch (error) {
            next(error)
      }        
    }
}