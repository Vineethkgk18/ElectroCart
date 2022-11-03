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
    getAddToWishList:async(req,res)=>{
        console.log("add to wishlist")
        let proId = req.params.id;
        let userId = req.session.user._id;
        let userWishList =  await wishListHelpers.addToWishlist(proId,userId)
        console.log("added to wishlist")
            res.json({status:true})
      },
     getViewWishList:async(req,res)=>{
        let userId = req.session.user._id;
        let user = req.session.user;
        let wProducts = await wishListHelpers.getWishListProducts(userId)
        let cartCount = await cartHelpers.getCartCount(userId)
        console.log("PPPPPPPP",wProducts)
        res.render('userpages/userWishlist',{wProducts,cartCount,users:true,orderSuccess:true,user})
      }
    }