const adminHelpers = require('../../helpers/adminHelpers')
const session = require('express-session');

module.exports={
    getCategory:(req,res)=>{
        //console.log("Category")
        adminHelpers.showCategory().then((category) =>{
          res.render('adminpages/adminCategoryManagement',{category})
        })
    },
    getAddCategory:(req,res)=>{
        res.render('adminpages/adminAddCategory')
      },
    getDeleteCategory:(req,res)=>{        
         let cateID = req.params.id;
         console.log("AAAAAAAAAAA",cateID)
         //console.log(cateID)
         adminHelpers.deleteCategory(cateID).then((response)=>{
          console.log(response)
           res.redirect('/admin/category')
         })
      },
      postAddCategory:(req,res)=>{
        console.log('req_body',req.body)
        adminHelpers.addCategory(req.body).then((response)=>{
          console.log('category added')
          res.redirect('/admin/category')
          //res.redirect
        })
        //res.redirect('/category')
      }

}