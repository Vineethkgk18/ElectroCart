const express = require('express');
const router = express.Router();
const userHelpers = require('../helpers/userHelpers')
const twilioHelpers = require('../helpers/twilioHelpers')
const session = require('express-session');
const userController = require ('../controllers/userController/userHomeController')
const prodController =require ('../controllers/userController/userProductController')
const cartController =require ('../controllers/userController/userCartController');
const wishListController = require ('../controllers/userController/wishListController');

const cartHelpers = require('../helpers/userHelpers/cartHelpers')


const wishListHelpers = require('../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../helpers/userHelpers/checkOutHelpers')


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
  res.render('userpages/userProfile',{users:true,user,orderSuccess:true})
})


router.post('/userProfileAddress',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let address = await userHelpers.addUserAddress(userId,req.body)
  res.redirect('/profile')
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
  //let total = await userHelpers.getToatalPrice(req.session.user._id)
  res.render('userpages/userProfile',{users:true,orderSuccess:true})//,{total,users:true})
})


router.get('/addToWishList/:id',verifyLogin, async(req,res)=>{
  console.log("add to wishlist")
  let proId = req.params.id;
  let userId = req.session.user._id;
  let userWishList =  await wishListHelpers.addToWishlist(proId,userId)
  console.log("added to wishlist")
      res.json({status:true})
})

router.get('/viewWishList',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let user = req.session.user;
  let wProducts = await wishListHelpers.getWishListProducts(userId)
  let cartCount = await cartHelpers.getCartCount(userId)
  console.log("PPPPPPPP",wProducts)
  res.render('userpages/userWishlist',{wProducts,cartCount,users:true,orderSuccess:true,user})
})

router.get('/userCheckOut',verifyLogin, async(req,res) =>{
  let userId = req.session.user._id;
  let user = req.session.user;
  let coupon = await userHelpers.getCoupon()
  let Products = await cartHelpers.getCartProducts(userId)
  let wishListCount = await wishListHelpers.wishListCount(userId) 
  let totalPrice = await cartHelpers.getTotoalPrice(userId)
  let wProducts = await wishListHelpers.getWishListProducts(userId)
  let cartCount = await cartHelpers.getCartCount(userId)  
  
  let addressInfo = req.session.user;
  console.log("00000000000000000000000000000", Products);
  //console.log("req.session.user._id",req.session.user)
  let grantTotal = totalPrice;
  let discountAmount=0;
  res.render('userpages/checkOut',{users:true,valueOf,user,totalPrice,discountAmount,grantTotal,Products,wProducts,wishListCount,cartCount,addressInfo,coupon })
})

router.post('/billingAddress', verifyLogin, async(req,res) =>{
  let userId = req.session.user._id;
  let add = req.body.address
  let Products = await cartHelpers.getCartProducts(userId)
  let address = await userHelpers.getAddressById(add,userId)
   res.json({address})
   //console.log("XXXXXXXXXXXXXXXXXX",address)
})

router.post('/confirmOrder',verifyLogin, async(req,res)=>{
  //console.log("XXXXXXXreq.body", req.body)
  let userId = req.session.user._id;
  let totalPrice = await cartHelpers.getTotoalPrice(userId)
  let cartProducts = await cartHelpers.getCartProducts(userId)
  userHelpers.placeOrder(req.body,userId,totalPrice,cartProducts).then((orderId)=>{
      //console.log("req.body.paymentMethod:", req.body.paymentMethod);
      //  console.log("orderId:",objectId(orderId))
      //  console.log("XXXXXXXXXXXXXXXXXXXXXXXXX");
      //  console.log("orderId:",orderId)

    if(req.body.paymentMethod ==='COD'){
      res.json({codSuccess:true})
    }
    else{
      userHelpers.generatedRazorPay(orderId,totalPrice).then((response)=>{
        //console.log("-----------response",response)
        res.json({response})
     })
    }   
  })
})

router.get('/orderSuccess',verifyLogin, async(req,res)=>{
  //console.log()
  res.render('userpages/userOrderSuccess')//{users:true,orderSuccess:false})
})

router.get('/viewOrder',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let order = await userHelpers.getOrder(userId);
  console.log("78787878787878")
  console.log("ViewOrder", order)
 //console.log("XXXXXXXXXX_Order",order)
  res.render('userpages/viewOrder',{users:true,order})
})

router.get('/viewOrderProducts/:id', async(req,res)=>{
  let products= await userHelpers.getOrderProducts(req.params.id)

})
router.post('/verifyPayment',verifyLogin, (req,res)=>{
  //console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZZ")
  console.log("req.body['order[response][receipt]']:",req.body['order[response][receipt]']);
  console.log("req.body-------req.body")
  userHelpers.verifyPaymentResult(req.body).then(()=>{
    console.log("PPPPPPPPPPPPPPPP")
    console.log("req.body['order[response][receipt]']:",req.body['order[response][receipt]']);
    userHelpers.changePaymentStatus(req.body['order[response][receipt]']).then( ()=>{
        console.log("Payment success")
      res.json({status:true})
    })

  }).catch((err)=>{
    console.log(err)
    res.json({status:false,errMsg:''})
  })
})

router.post('/applyCoupon',verifyLogin, async(req,res)=>{
  let userId = req.session.user._id;
  let couponDetails= req.body;
   
  let totalPrice = await cartHelpers.getTotoalPrice(userId)
  let couponData = await checkOutHelpers.checkCouponValidity(couponDetails.couponId,userId)

  //console.log("couponUsage:",couponData)
   req.session.couponData = couponData; 
   req.session.totalAmount = req.body.totalPrice;
    couponData.totalPrice=totalPrice
   console.log( "fxXFXXFXFX_couponData:",couponData)

  /**
   * 
   * couponData contains all the value related to the validity of the 
   * coupon 
   * if coupon is expired it shows expiry:true
   * if coupon is valied it returns the coupon data
   * 
   */
  res.json({couponData})

  
})

module.exports = router;






