const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');


module.exports ={  
    getAllProductsView: async(req,res)=>{
        //let catId=req.params.id;
        let userId=req.session.user._id
        let user = req.session.user;
        let cartCount = await userHelpers.getCartCount(userId)
        let products = await userHelpers.getProducts();
        let category = await userHelpers.getCategory();
        console.log("category:",category)
        let wishListCount = await userHelpers.wishListCount(userId)
        res.render('userpages/userAllProducts',{products,cartCount,category,wishListCount })
    }, 
    getCategoryView: async (req,res) => {
        let catId=req.params.id;
        let userId=req.session.user._id
        let user = req.session.user;
       // console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await userHelpers.wishListCount(userId)
        let cartCount = await userHelpers.getCartCount(userId)
        //console.log("SSSSSSSSSSSSSSSSSSSSSSSS",catId);        
        let products = await userHelpers.getFilterProduct(catId);
        let category = await userHelpers.getCategory();
        let cat = await userHelpers.getFilterCategory(catId);
     res.render('userpages/userProduct',{users:true,orderSuccess:true, products,category,cat,cartCount,wishListCount,user})
     },
     getSingleProduct: async (req,res)=>{
        let userId=req.session.user._id
        //let userId=req.session.user.id
        let user = req.session.user;
        //console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await userHelpers.wishListCount(userId)
        let cartCount = await userHelpers.getCartCount(userId)
          let proId = req.params.id;
          product = await userHelpers.getProductById(proId);
          res.render('userpages/singleProduct',{users:true,orderSuccess:true,product,cartCount,wishListCount,user})
      },
      
}