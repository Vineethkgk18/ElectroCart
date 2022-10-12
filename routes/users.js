const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/userHelpers')
const twilioHelpers = require('../helpers/twilioHelpers')
const session = require('express-session');
const userController = require ('../controllers/userController/userHomeController')
const prodController =require ('../controllers/userController/userProductController')
const cartController =require ('../controllers/userController/userCartController');
const { get } = require('../config/connection');
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

//##################################################################
router.get('/profile',verifyLogin,(req,res) =>{
  let user = req.session.user;
  console.log("user___",user)
  res.render('userpages/userProfile',{users:true,user})
})

router.get('/userAddress', verifyLogin, (req,res)=>{
  let user = req.session.user;

res.render('userpages/userAddress',{users:true,user})
})

//##################################################################

 //router.get('/allProducts, prodController.allProductView')
 
router.get('/categoryView/:id', prodController.getCategoryView)

router.get('/singleProduct/:id', prodController.getSingleProduct)

router.get('/addToCart/:id',verifyLogin, cartController.getAddToCart)

router.get('/viewCart',verifyLogin, cartController.getViewCart)

router.post('/changeProductQuantity', (req,res,next) =>{
  console.log("req_body",req.body)
  userHelpers.changeProductQuantity(req.body).then(async(response)=>{
    response.total = await userHelpers.getTotoalPrice(req.body.user)
    res.json(response)
  })
})

router.get('/placeOrder',verifyLogin, async(req,res)=>{
  //let total = await userHelpers.getToatalPrice(req.session.user._id)
  res.render('userpages/userProfile',{users:true})//,{total,users:true})
})




router.get('/addToWishList/:id',verifyLogin, async(req,res)=>{
  console.log("add to wishlist")
  let proId = req.params.id;
  let userId = req.session.user._id;
  //let userWishList = await userHelpers.addToWishlist(proId,userId)
  let userWishList =  await userHelpers.addToWishlist(proId,userId)
  console.log("added to wishlist")
      res.json({status:true})
})

router.get('/viewWishList',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let user = req.session.user;
  let wProducts = await userHelpers.getWishListProducts(userId)
  let cartCount = await userHelpers.getCartCount(userId)
  //res.redirect('/')
  console.log("PPPPPPPP",wProducts)
  res.render('userpages/userWishlist',{wProducts,cartCount,users:true,user})
})

router.get('/userCheckOut', (req,res) =>{

  res.render('userpages/userCheckOut')
})
module.exports = router;


