const adminHelpers = require('../../helpers/adminHelpers/adminHelpers')
const adminDashboardHelpers = require('../../helpers/adminHelpers/adminDashboardHelpers')
const bannerHelpers = require('../../helpers/adminHelpers/bannerHelpers');
const session = require('express-session');

module.exports ={
    getAdminHome: async (req, res, next)=> {
          try {
            let userCount = await adminDashboardHelpers.getUsersCount()          
            let orderCount = await adminDashboardHelpers.getOrdersCount()
            let deliveredCount = await adminDashboardHelpers.getNumberOfOrderDelivered()
            let codCount = await adminDashboardHelpers.getCodCount()
            let onlineCount = await adminDashboardHelpers.getOnlineCount()          
            let MonthlySales = await adminDashboardHelpers.getTotalSalesMonthly()
            
            monthlySalesOctober = MonthlySales[1].total/1000000;
            monthlySalesNovember = MonthlySales[0].total/1000000;
            totalSales = monthlySalesOctober + monthlySalesNovember;      
            res.render('adminpages/adminHome',{userCount,orderCount,deliveredCount,monthlySalesOctober,monthlySalesNovember,totalSales})
          } catch (error) {
              next(error)
          }         
      },

    getAdminSignUp:(req,res)=>{
        try {
          res.render('adminpages/adminSignUp')
        } catch (error) {
          next(error)
        }        
      },

    postAdminSignUp:async (req,res)=>{
      try {
            req.session.signUpData = req.body;
            let adminEmail = await adminHelpers.verifyEmail(req.body.Email);
            if(adminEmail){
                console.log("ERROR User Exists")
                alert("ERROR User Exists")
                res.redirect('admin/signup')
            }
            else{
            let adminData = req.session.signUpData;
            let data = await adminHelpers.doSignup(adminData)       
              res.redirect('/admin/adminLogin')
            }
        } catch (error) {
          next(error)
        }
      },
    getAdminLogin: (req,res)=>{
          try {
            res.render('adminpages/adminLogin')
          } catch (error) {
            next(error)
          }  
      },
    postAdminLogin: async (req,res) => {
        try {
                let response = await adminHelpers.doLogin(req.body)
                if(response.status){              
                  res.redirect('/admin')
                }else{
                  res.redirect('/admin/adminLogin')
                }
        } catch (error) {
            next(error)
        }
         
          
      }

}