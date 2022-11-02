const adminHelpers = require('../../helpers/adminHelpers')
const session = require('express-session');
const bannerHelpers = require('../../helpers/adminHelpers/bannerHelpers');

module.exports={
    
    getBannerManage:async(req,res)=>{
        try {
            let banner = await bannerHelpers.viewBanner();
        res.render('adminpages/adminBannerManagement',{banner})
        } catch (error) {
            
        }
    },
    getAddBanner:(req,res)=>{
        try {
            res.render('adminpages/adminAddBanner')
        } catch (error) {
            
        }
    },
    postAddBanner:(req,res) =>{
        //let bannerData = req.body;
        console.log("XXXXXXXXXXXXXXXXXXXXXXXXbannerData _req,body:",req.body)
        bannerHelpers.addbanner(req.body).then(()=>{
          res.redirect('/admin/banner')
        })
      }

}