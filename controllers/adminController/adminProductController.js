const adminHelpers = require('../../helpers/adminHelpers')
const session = require('express-session');

module.exports ={
    getProduct: (req,res)=>{
        adminHelpers.getAllProducts().then((products)=>{
         //console.log("products:",products)
         res.render('adminpages/adminProductManagement',{products})
     })
     },
     getAddProduct: (req,res)=>{
        adminHelpers.showCategory().then((category) =>{
        res.render('adminpages/adminAddProduct',{category})
        })
      },
      postAddProduct: async(req,res) => {
        //console.log(req.files)
        const Images = [];
        for( let i=0; i < req.files.length; i++ ){
          Images[i] = req.files[i].filename
        }
        req.body.Images = Images;
        console.log("req.body:",req.body);
       let category = await adminHelpers.getCategoryName(req.body.CategoryID)
        req.body.Images = Images;
        req.body.CategoryName = category.Name;
        //req.body.CategoryID = category._id;
        adminHelpers.addProduct(req.body).then(()=>{
        res.redirect('/admin/product')
      })
      },
      getEditProduct : async(req,res)=>{
        let proId = req.params.id;        
        let products = await adminHelpers.getProductDetails(proId);
        let category = await adminHelpers.showCategory();
        res.render('adminpages/adminEditProduct',{products,category})
      },
      postEditProduct : async(req,res) => {        
        const Images = [];
        for( let i=0; i < req.files.length; i++ ){
          Images[i] = req.files[i].filename
        }  
         //console.log("SSSSSS_req.body.CatergotyID",req.body.CategoryID)

        let category = await adminHelpers.getCategoryName(req.body.CategoryID)
        req.body.CategoryName=category.Name;
        req.body.Images = Images;  
       let products = await adminHelpers.updateProducts(req.body)
           
        res.redirect('/admin/product')
      },
      getDeleteProduct: (req,res) => {
        let productId = req.params.id;
        console.log("req_params:", req.params)        
         adminHelpers.deleteProduct(productId).then( (response)=>{
          console.log("response:",response)
          res.redirect('/admin/product')
        })
      }
      
}