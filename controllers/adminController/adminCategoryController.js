const adminHelpers = require('../../helpers/adminHelpers/adminHelpers')
const session = require('express-session');

module.exports={
    getCategory:async (req,res)=>{        
            try {
              let category = await adminHelpers.showCategory()
              res.render('adminpages/adminCategoryManagement',{category})
            } catch (error) {
              next(error)
            }
    },
    getAddCategory:(req,res)=>{
          try {
            res.render('adminpages/adminAddCategory')
          } catch (error) {
            next(error)
          }        
    },
    getDeleteCategory:async (req,res)=>{
          try {
            let cateID = req.params.id;
            let response = await adminHelpers.deleteCategory(cateID)
            res.redirect('/admin/category')
          } catch (error) {
            next(error)
          }     
      },
      postAddCategory:async(req,res)=>{
            try {
                let response = await adminHelpers.addCategory(req.body)
                res.redirect('/admin/category')
            } catch (error) {
              next(error)
            }     
      }

}