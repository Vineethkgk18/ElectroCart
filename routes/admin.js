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


















