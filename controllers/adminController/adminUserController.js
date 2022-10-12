const adminHelpers = require('../../helpers/adminHelpers')

module.exports ={
    getViewUser: (req,res)=>{
        adminHelpers.getAllUsers().then((users)=>{
          //console.log("getusers:",users)
          res.render('adminpages/admin-userManagement',{users})
        })
      },
    getBlockUser: (req,res)=>{
        console.log("block user")
        let userId = req.params.id;
        console.log(userId)
        adminHelpers.blockUser(userId).then((response) =>{
          res.redirect('/admin/viewUser')
        })
      },
      getUnBlockUser: (req,res)=>{
        console.log("unblock user")
        let userId = req.params.id;
        console.log(userId)
      //   console.log("block user")
      //   // console.log(userId)
        adminHelpers.unBlockUser(userId).then((response) =>{
            res.redirect('/admin/viewUser')
          })
      }
}