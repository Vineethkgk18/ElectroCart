const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');


module.exports ={
    // getAllProduct: async(req,res) =>{
    //     let products = await userHelpers.getProducts();

    // },
    getCategoryView: async (req,res) => {
        let catId=req.params.id;
        let userId=req.session.user._id
        let user = req.session.user;
        console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await userHelpers.whilistlistCount(userId)
        let cartCount = await userHelpers.getCartCount(userId)
        //console.log("SSSSSSSSSSSSSSSSSSSSSSSS",catId);        
        let products = await userHelpers.getFilterProduct(catId);
        let category = await userHelpers.getCategory();
        let cat = await userHelpers.getFilterCategory(catId);
     res.render('userpages/userProduct',{users:true, products,category,cat,cartCount,wishListCount,user})
     },
     getSingleProduct: async (req,res)=>{
        let userId=req.session.user._id
        //let userId=req.session.user.id
        let user = req.session.user;
        console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await userHelpers.whilistlistCount(userId)
        let cartCount = await userHelpers.getCartCount(userId)
          let proId = req.params.id;
          product = await userHelpers.getProductById(proId);
          res.render('userpages/singleProduct',{users:true,product,cartCount,wishListCount,user})
      },

      // getAddToCart: (req,res) =>{
      //   res.render('userpages/userShoppingCart', {user:true})
      // },
      
      
}