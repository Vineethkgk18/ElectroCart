const express = require('express');
// const { response } = require('../app');
const adminHelpers = require('../helpers/adminHelpers');
const router = express.Router();
const adminhController = require('../controllers/adminController/adminHomeController')
const adminuController = require('../controllers/adminController/adminUserController')
const admincController = require('../controllers/adminController/adminCategoryController')
const adminpController = require('../controllers/adminController/adminProductController')
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
router.get('/editProduct/:id', adminpController.getEditProduct)
//-------------------EDIT Product ---------------------
router.post('/adminEditProduct', upload.array('Image',4), adminpController.postEditProduct)


//----------delete Product -----------------------------
router.get('/deleteProduct/:id', adminpController.getDeleteProduct)

router.get('/order',async(req,res)=>{
  let order = await adminHelpers.getOrderDetails()
  //console.log("order:", order)
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

//############## CouponManagemanet ##################

router.get('/coupon', async(req,res)=>{
  //let order = await adminHelpers.getOrderDetails()
  let couponData = await adminHelpers.getCouponCollection()
  res.render('adminpages/adminCouponManagement',{couponData})
})
router.get('/addCoupon',(req,res)=>{
  
  res.render("adminpages/adminAddCoupon")
})

router.post('/adminAddCoupon', async(req,res)=>{
  let couponData = req.body;
  // console.log("SSSSSSSSS_req.body:", req.body)
 // console.log("SSSSSSSSS_req.body:", couponData)
  let coupon = await adminHelpers.addCoupon(couponData)
  res.redirect('/admin/coupon')
})
router.get("/deleteCoupon/:id",async(req,res)=>{
 let couponId = req.params.id;
  await adminHelpers.deleteCoupon(couponId)
  res.redirect('/admin/coupon')
})
module.exports = router;  



//------------multer Single Image -------------------------------
// router.post('/adminAddProduct', upload.single('Image'), (req,res)=>{
//   console.log(req.file, req.body)
//    adminHelpers.addProduct(req.body).then((response)=>{
//      res.redirect('/admin/product')
//    })
// })
//--------------multiple file using multer ---------------------
// router.post('/adminAddProduct', upload.array('Image',4), (req,res) => {
//     console.log(req.files)
//     const Images = [];
//     for( let i=0; i < req.files.length; i++ ){
//       Images[i] = req.files[i].filename
//     }
//     req.body.Images = Images;
//     adminHelpers.addProduct(req.body).then(()=>{
//     res.redirect('/admin/product')
//   })
// })


















