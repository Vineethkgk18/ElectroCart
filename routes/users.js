const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/userHelpers')
const twilioHelpers = require('../helpers/twilioHelpers')
const session = require('express-session');
const userController = require ('../controllers/userController/userHomeController')
const prodController =require ('../controllers/userController/userProductController')
const cartController =require ('../controllers/userController/userCartController');
const { get } = require('../config/connection');
const { Db, ObjectId } = require('mongodb-legacy');
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

//##################################################################
router.get('/profile',verifyLogin,(req,res) =>{
  let user = req.session.user;
  console.log("user___",user)
  res.render('userpages/userProfile',{users:true,user,orderSuccess:true})
})

router.post('/userProfileAddress',verifyLogin, async(req,res)=>{
  console.log("user_ profile_address:", req.body)
  console.log("AAAAAAAAAAAAAAAAAAAAA")
  console.log("req_body_id",req.session.user._id)
  let userId = req.session.user._id;
  let address = await userHelpers.addUserAddress(userId,req.body)

  res.redirect('/profile')
})

// router.get('/userAddress', verifyLogin, (req,res)=>{
//   let user = req.session.user;

// res.render('userpages/userAddress',{user})
// })

//##################################################################

 //router.get('/allProducts, prodController.allProductView')
 
router.get('/categoryView/:id', prodController.getCategoryView)

router.get('/singleProduct/:id', prodController.getSingleProduct)

router.get('/addToCart/:id',verifyLogin, cartController.getAddToCart)

router.get('/viewCart',verifyLogin, cartController.getViewCart)

router.post('/changeProductQuantity',verifyLogin, cartController.postChangeProductQuantity)

router.get('/placeOrder',verifyLogin, async(req,res)=>{
  //let total = await userHelpers.getToatalPrice(req.session.user._id)
  res.render('userpages/userProfile',{users:true,orderSuccess:true})//,{total,users:true})
})




router.get('/addToWishList/:id',verifyLogin, async(req,res)=>{
  console.log("add to wishlist")
  let proId = req.params.id;
  let userId = req.session.user._id;
  let userWishList =  await userHelpers.addToWishlist(proId,userId)
  console.log("added to wishlist")
      res.json({status:true})
})

router.get('/viewWishList',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let user = req.session.user;
  let wProducts = await userHelpers.getWishListProducts(userId)
  let cartCount = await userHelpers.getCartCount(userId)
  console.log("PPPPPPPP",wProducts)
  res.render('userpages/userWishlist',{wProducts,cartCount,users:true,orderSuccess:true,user})
})

router.get('/userCheckOut',verifyLogin, async(req,res) =>{
  let userId = req.session.user._id;
  let user = req.session.user;
  let Products = await userHelpers.getCartProducts(userId)
  let wishListCount = await userHelpers.wishListCount(userId) 
  let totalPrice = await userHelpers.getTotoalPrice(userId)
  let wProducts = await userHelpers.getWishListProducts(userId)
  let cartCount = await userHelpers.getCartCount(userId)  

  let addressInfo = req.session.user;
  console.log("00000000000000000000000000000", Products);
  //console.log("req.session.user._id",req.session.user)

  res.render('userpages/checkOut',{users:true,valueOf,user,totalPrice,Products,wProducts,wishListCount,cartCount,addressInfo })
})

router.post('/billingAddress', verifyLogin, async(req,res) =>{
  let userId = req.session.user._id;
  let add = req.body.address
  let Products = await userHelpers.getCartProducts(userId)
  let address = await userHelpers.getAddressById(add,userId)
   res.json({address})
   //console.log("XXXXXXXXXXXXXXXXXX",address)
})
router.post('/confirmOrder',verifyLogin, async(req,res)=>{
  //console.log("XXXXXXXreq.body", req.body)
  let userId = req.session.user._id;
  let totalPrice = await userHelpers.getTotoalPrice(userId)
  let cartProducts = await userHelpers.getCartProducts(userId)
  userHelpers.placeOrder(req.body,userId,totalPrice,cartProducts).then((orderId)=>{
    
      // console.log("req.body.paymentMethod:", req.body.paymentMethod);
       console.log("orderId:",objectId(orderId))
       console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
       console.log("orderId:",orderId)

    if(req.body.paymentMethod =='COD'){
      res.json({status:true})
    }
    else{
      userHelpers.generatedRazorPay(orderId,totalPrice).then((response)=>{
        res.json({response})
     })
    }   
  })
})

router.get('/orderSuccess',verifyLogin, async(req,res)=>{
  
  res.render('userpages/userOrderSuccess')//{users:true,orderSuccess:false})
})

router.get('/viewOrder',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let order = await userHelpers.getOrder(userId);
 console.log("XXXXXXXXXX_Order",order)

  res.render('userpages/viewOrder',{users:true,order})
})

router.get('/viewOrderProducts/:id', async(req,res)=>{
  let products= await userHelpers.getOrderProducts(req.params.id)

})
module.exports = router;






