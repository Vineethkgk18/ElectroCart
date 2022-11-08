const adminHelpers = require('../../helpers/adminHelpers/adminHelpers')

module.exports ={
    getViewUser: async(req,res)=>{
        try {
          let userdata = await adminHelpers.getAllUsers()
          res.render('adminpages/adminUserManagement',{userdata})
        } catch (error) {
              next(error)
        } 
    },
    getBlockUser: async(req,res)=>{
        try {
              let userId = req.params.id;        
              let response = await adminHelpers.blockUser(userId)
              res.redirect('/admin/viewUser')
        } catch (error) {
            next(error)
        }
        
       
      },
    getUnBlockUser: async(req,res)=>{
        try {
              let userId = req.params.id;        
              let response = await adminHelpers.unBlockUser(userId)
              res.redirect('/admin/viewUser')
        } catch (error) {
              next(error)
        }
    }
}