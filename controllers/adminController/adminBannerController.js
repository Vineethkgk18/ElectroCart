const adminHelpers = require('../../helpers/adminHelpers')
const session = require('express-session');

module.exports={
    getBannerManage:(req,res)=>{
        res.render('adminpages/adminBannerManagement')
        // try{
        //         res.render('adminpages/adminBannerManagement')
        // }catch{

        // }
    },
    getAddBanner:(req,res)=>{
        
        res.render('adminpages/adminAddBanner')
    }
}