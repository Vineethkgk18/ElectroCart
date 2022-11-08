const adminHelpers = require('../../helpers/adminHelpers/adminHelpers')
const session = require('express-session');

module.exports ={
    getProduct: async(req,res)=>{
      /**
       * 
       */
          try {
                let products = await adminHelpers.getAllProducts()
                res.render('adminpages/adminProductManagement',{products})
          } catch (error) {
            next(error)
          }      
    },

     getAddProduct: async(req,res)=>{
      /**
       * 
       */
          try {
                let category = await adminHelpers.showCategory()
                res.render('adminpages/adminAddProduct',{category})
          } catch (error) {
            next(error)
          }
    },

    postAddProduct: async(req,res) => {
      /**
       * 
       */
         try {
              const Images = [];
              for( let i=0; i < req.files.length; i++ ){
                Images[i] = req.files[i].filename
              }
              req.body.Images = Images;
              
            let category = await adminHelpers.getCategoryName(req.body.CategoryID)
              req.body.Images = Images;
              req.body.CategoryName = category.Name;
              
            let addProduct = await adminHelpers.addProduct(req.body)
            res.redirect('/admin/product')
         } catch (error) {
          next(error)
         }
    },

    getEditProduct : async(req,res)=>{
      /**
       * 
       */
          try {
                let proId = req.params.id;        
                let products = await adminHelpers.getProductDetails(proId);
                let category = await adminHelpers.showCategory();
                res.render('adminpages/adminEditProduct',{products,category})
          } catch (error) {
                next(error)
          }
    },
    postEditProduct : async(req,res) => { 
      /**
       * 
       */
        try {
                const Images = [];
                for( let i=0; i < req.files.length; i++ ){
                  Images[i] = req.files[i].filename
                }  
                let category = await adminHelpers.getCategoryName(req.body.CategoryID)
                req.body.CategoryName=category.Name;
                req.body.Images = Images;  
                let products = await adminHelpers.updateProducts(req.body)           
                res.redirect('/admin/product')
        } catch (error) {
          next(error)
        }
    },

    getDeleteProduct: async (req,res) => {
      /**
       * 
       */
          try {
                let productId = req.params.id;              
                let response = await adminHelpers.deleteProduct(productId)
                res.redirect('/admin/product')
          } catch (error) {
               next(error)
          }         
     }
      
}