const adminHelpers = require('../../helpers/adminHelpers')
const session = require('express-session');

module.exports ={
    getAdminHome: function(req, res, next) {
        res.render('adminpages/adminHome')
      },
    getAdminLogin: (req,res)=>{
        res.render('adminpages/adminLogin')
      },
    postAdminLogin: (req,res) => {
        console.log("req_body")
        console.log(req.body)
          adminHelpers.doLogin(req.body).then((response) => {
            if(response.status){
              console.log("response:",response)
              res.redirect('/admin')
            }else{
              res.redirect('/admin/adminLogin')
            }
          })
      }

}