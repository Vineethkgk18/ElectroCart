const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/userHelpers/userHelpers')
const twilioHelpers = require('../helpers/twilioHelpers')
const session = require('express-session');
const userController = require ('../controllers/userController/userHomeController')
const prodController =require ('../controllers/userController/userProductController')
const cartController =require ('../controllers/userController/userCartController');
const wishListController = require ('../controllers/userController/wishListController');
const checkOutController = require ('../controllers/userController/checkOutController');
const userOrderController = require ('../controllers/userController/userOrderController' )

const cartHelpers = require('../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../helpers/userHelpers/checkOutHelpers')
const db = require ('../config/connection')
const { json } = require('express');
const objectId=require('mongodb').ObjectId

/* GET users listing. */

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{  
    res.redirect('/login')
  }
}

const directToCart=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    req.session.cart = true;
    req.session.proid = req.params.id;
  }
}

router.get('/',verifyLogin, userController.renderHome)
   
router.get('/login', userController.getUserLogin)

router.post('/login', userController.postUserLogin)

router.get('/signup', userController.getUserSignUp)

router.post('/signup', userController.postUserSignUp)

router.post('/otp', userController.postSignUpOtp)

router.get('/logout', userController.getUserLogOut)

router.get('/profile',verifyLogin,(req,res) =>{
  let user = req.session.user;
  res.render('userpages/userProfile',{users:true,user,orderSuccess:true})
})

router.post('/userProfileAddress',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let address = await userHelpers.addUserAddress(userId,req.body)
  res.redirect('/profile')
})
router.get('/errorPage',(req,res) =>{
  res.render('userpages/userError')
})
router.post('/addAddress',(req,res)=>{

  console.log("XXXXXX_req.body", req.body);  
})

 //router.get('/allProducts, prodController.allProductView')
 
router.get('/categoryView/:id',verifyLogin, prodController.getCategoryView)

router.get('/allProductView', verifyLogin, prodController.getAllProductsView)

router.get('/singleProduct/:id', verifyLogin, prodController.getSingleProduct)

router.get('/addToCart/:id',verifyLogin, cartController.getAddToCart)

router.get('/viewCart',verifyLogin, cartController.getViewCart)

router.post('/changeProductQuantity',verifyLogin, cartController.postChangeProductQuantity)

router.get('/placeOrder',verifyLogin, async(req,res)=>{
    try {
          //let total = await userHelpers.getToatalPrice(req.session.user._id)
          res.render('userpages/userProfile',{users:true,orderSuccess:true})//,{total,users:true})
    } catch (error) {
        next(error)
    }
})

router.get('/addToWishList/:id',verifyLogin,  wishListController.getAddToWishList)

router.get('/viewWishList',verifyLogin, wishListController.getViewWishList)

router.get('/userCheckOut',verifyLogin,checkOutController.getUserCheckOut)

router.post('/billingAddress', verifyLogin,checkOutController.postBillingAddress)

router.post('/confirmOrder',verifyLogin,checkOutController.postConfirmOrder) 

router.get('/orderSuccess',verifyLogin,checkOutController.getOrderSuccess)

router.post('/verifyPayment',verifyLogin, checkOutController.postVerifyPayment)

router.post('/applyCoupon',verifyLogin, checkOutController.postApplyCoupon)

router.get('/viewOrder',verifyLogin, userOrderController.getViewOrder)

router.get('/viewOrderProducts/:id',verifyLogin, userOrderController.getViewOrderProducts)

router.post( '/changeOrderStatus', verifyLogin, userOrderController.postChangeOrderStatus)

router.get('/orderCancelled',verifyLogin, userOrderController.getOrderCancelled)

module.exports = router;






