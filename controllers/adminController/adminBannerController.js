const adminHelpers = require('../../helpers/adminHelpers/adminHelpers')
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
    postAddBanner:async(req,res) =>{
        try {
            req.body.Image = req.files[0].filename;        
            let ban = await bannerHelpers.addbanner(req.body)
            res.redirect('/admin/banner')
        } catch (error) {
            next(error)
        }
        
    } 
}