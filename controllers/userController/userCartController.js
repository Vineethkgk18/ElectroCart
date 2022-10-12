const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');

module.exports ={
    getAddToCart: async (req,res)=>{     
      let userId = req.session.user._id;
      let proId = req.params.id;
      //console.log("  Api call ")
            let userCart =  await userHelpers.addToCart(proId,userId)
      
      res.json({status:true})
      //res.redirect('/')
      },

      getViewCart: async (req,res)=>{
        let userId = req.session.user._id;
        let user = req.session.user;
        let Products = await userHelpers.getCartProducts(userId)
        let totalPrice = await userHelpers.getTotoalPrice(userId)
        let wProducts = await userHelpers.getWishListProducts(userId)
        let cartCount = await userHelpers.getCartCount(userId)
       // console.log("OOOOOOOOOO_Products",Products)
        //Product_Name
        
      res.render('userpages/userShoppingCart',{Products,users:true,user,totalPrice,wProducts,cartCount})
      }

}