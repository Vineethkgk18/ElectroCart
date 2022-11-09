const express = require('express');
const adminHelpers = require('../helpers/adminHelpers/adminHelpers');
const router = express.Router();
const adminhController = require('../controllers/adminController/adminHomeController')
const adminuController = require('../controllers/adminController/adminUserController')
const admincController = require('../controllers/adminController/adminCategoryController')
const adminpController = require('../controllers/adminController/adminProductController')
const adminBannerController = require('../controllers/adminController/adminBannerController')

//const bannerHelpers = require('../helpers/adminHelpers/bannerHelpers');
const multer = require('multer')
//const upload = multer({ dest:'./public/Admin/uploadedImage'})  // --------------multer 

const fileStorageEngine = multer.diskStorage({
  destination:(req,file,cb) => {
    cb( null, './public/Admin/uploadedImage')
  },
  filename: (req, file, cb) => {
    cb(null,Date.now()+'__'+file.originalname)
  }
})

const upload = multer({ storage: fileStorageEngine})
/* GET home page. */

router.get('/', adminhController.getAdminHome)

router.get('/adminLogin', adminhController.getAdminLogin)

router.post('/adminLogin', adminhController.postAdminLogin)

router.get ('/adminSignUp',adminhController.getAdminSignUp)

router.post('/SignUp', adminhController.postAdminSignUp)

//----------User Management -----------------------
router.get('/viewUser', adminuController.getViewUser)

// --------------block user ---------------------
router.get('/blockUser/:id', adminuController.getBlockUser)

//----------unblock user-----------------------
router.get('/unblockUser/:id', adminuController.getUnBlockUser)

//--------------Category Management Start here -------------
router.get('/category', admincController.getCategory)

router.get('/addCategory', admincController.getAddCategory)

router.get('/deleteCategory/:id', admincController.getDeleteCategory)

router.post('/adminAddCategory', admincController.postAddCategory)

//--------------ProductManagement Start here -------------
router.get('/product', adminpController.getProduct)

router.get('/addProduct',adminpController.getAddProduct) 

router.post('/adminAddProduct', upload.array('Image',4), adminpController.postAddProduct)

//----------Edit Product -------------------------------
//router.get('/editProduct/:id', adminpController.getEditProduct)
router.get('/editProduct/:id', adminpController.getEditProduct)
//-------------------EDIT Product ---------------------
//router.post('/adminEditProduct', upload.array('Image',4), adminpController.postEditProduct)
router.post('/adminEditProduct', upload.array('Image',4), adminpController.postEditProduct)

//----------delete Product -----------------------------
router.get('/deleteProduct/:id', adminpController.getDeleteProduct)

// --------------Banner management -------------------------
router.get('/banner',adminBannerController.getBannerManage)
// --------------add new banner ----------------------------
router.get('/addBanner',adminBannerController.getAddBanner)
// --------------store new banner --------------------------
router.post('/adminAddBanner',upload.array('Image',1), adminBannerController.postAddBanner)



router.get('/order',async(req,res)=>{
  let order = await adminHelpers.getOrderDetails()  
  res.render('adminpages/adminOrderManagement',{order})
})

router.get('/item-packed/:id',(req,res)=>{
  let orderId= req.params.id;
  let status = "packed"
  let orderStatus = adminHelpers.changeOrderStatus(status,orderId)
  //let order = await adminHelpers.getOrderDetails()
  res.redirect('/admin/order')
})

router.get('/item-shipped/:id',(req,res)=>{
  let orderId= req.params.id;
  let status = "Shipped"
  let orderStatus = adminHelpers.changeOrderStatus(status,orderId)
  res.redirect('/admin/order')
})
router.get('/item-delivered/:id',(req,res)=>{
  let orderId= req.params.id;
  let status = "Delivered"
  let orderStatus = adminHelpers.changeOrderStatus(status,orderId)
  res.redirect('/admin/order')
})
/*  ----------   CouponManagemanet    -------  */
router.get('/coupon', async(req,res)=>{ 
    try {
        let couponData = await adminHelpers.getCouponCollection()
        res.render('adminpages/adminCouponManagement',{couponData})
    } catch (error) {
        next(error)
    } 
})
router.get('/addCoupon',(req,res)=>{ 
    try {
        res.render("adminpages/adminAddCoupon")
    } catch (error) {
        next(error)
    } 
})

router.post('/adminAddCoupon', async(req,res)=>{
    try {
          let couponData = req.body;
          let coupon = await adminHelpers.addCoupon(couponData)
          res.redirect('/admin/coupon')
    } catch (error) {
          next(error)
    }
})
router.get("/deleteCoupon/:id",async(req,res)=>{
    try {
          let couponId = req.params.id;
          let coupon = await adminHelpers.deleteCoupon(couponId)
          res.redirect('/admin/coupon')
    } catch (error) {
          next(error)
    }
})

router.use(function(req, res, next) {
  next(createError(404));
});

router.use(function(err, req, res, next) {
  console.log(err);
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('adminpages/adminError')
});

module.exports = router;  






















