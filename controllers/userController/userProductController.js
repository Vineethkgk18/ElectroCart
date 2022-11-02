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
    getAllProductsView: async(req,res)=>{
        //let catId=req.params.id;
        let userId=req.session.user._id
        let user = req.session.user;
        let cartCount = await cartHelpers.getCartCount(userId)
        let products = await productHelpers.getProducts();
        let category = await categoryHelpers.getCategory();
        console.log("category:",category)
        let wishListCount = await wishListHelpers.wishListCount(userId)
        res.render('userpages/userAllProducts',{users:true,orderSuccess:true, products,cartCount,category,wishListCount })
    }, 
    getCategoryView: async (req,res) => {
        let catId=req.params.id;
        console.log("catId:",catId)
        let userId=req.session.user._id
        let user = req.session.user;
       // console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await wishListHelpers.wishListCount(userId)
        let cartCount = await cartHelpers.getCartCount(userId)
        //console.log("SSSSSSSSSSSSSSSSSSSSSSSS",catId);        
        let products = await productHelpers.getFilterProduct(catId);
        let category = await categoryHelpers.getCategory();
        let cat = await categoryHelpers.getFilterCategory(catId);
     res.render('userpages/userProduct',{users:true,orderSuccess:true, products,category,cat,cartCount,wishListCount,user})
     },
     getSingleProduct: async (req,res)=>{
        let userId=req.session.user._id
        //let userId=req.session.user.id
        let user = req.session.user;
        //console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let wishListCount = await wishListHelpers.wishListCount(userId)
        let cartCount = await cartHelpers.getCartCount(userId)
          let proId = req.params.id;
          product = await productHelpers.getProductById(proId);
          res.render('userpages/singleProduct',{users:true,orderSuccess:true,product,cartCount,wishListCount,user})
      }
}