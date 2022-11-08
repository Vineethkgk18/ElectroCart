const adminHelpers = require('../../helpers/adminHelpers')
const adminDashboardHelpers = require('../../helpers/adminHelpers/adminDashboardHelpers')
const bannerHelpers = require('../../helpers/adminHelpers/bannerHelpers');
const session = require('express-session');

module.exports ={
    getAdminHome: async (req, res, next)=> {
         let userCount = await adminDashboardHelpers.getUsersCount()          
         let orderCount = await adminDashboardHelpers.getOrdersCount()
         let deliveredCount = await adminDashboardHelpers.getNumberOfOrderDelivered()
         let codCount = await adminDashboardHelpers.getCodCount()
         let onlineCount = await adminDashboardHelpers.getOnlineCount()
          //let banner = await bannerHelpers.viewBanner();
          let MonthlySales = await adminDashboardHelpers.getTotalSalesMonthly()
          console.log("MonthlySales._id.year :", MonthlySales[0]._id.year);
          console.log(" MonthlySales._id.month :",MonthlySales[0]._id.month );
          console.log("MonthlySales.toatal:",MonthlySales[0].total)
          console.log("MonthlySales.toatal:",MonthlySales[1].total)
          monthlySalesOctober = MonthlySales[1].total/1000000;
          monthlySalesNovember = MonthlySales[0].total/1000000;
          totalSales = monthlySalesOctober + monthlySalesNovember;
          //let MonthlySales =  await adminDashboardHelpers.getTotalMonthly()
          console.log("QQQQQQ_MonthlySales", MonthlySales)
          // console.log(" AAAA_onlineCount:",onlineCount)
          // console.log("BBBB_codCount:", codCount)
          // console.log("deliveredCount:",deliveredCount)
      res.render('adminpages/adminHome',{userCount,orderCount,deliveredCount,monthlySalesOctober,monthlySalesNovember,totalSales})
       // res.render('adminpages/adminHome')
      },
    getAdminSignUp:(req,res)=>{
        res.render('adminpages/adminSignUp')
      },
    postAdminSignUp:async (req,res)=>{

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
       //let sms = await twilioHelpers.sendSms(req.session.signUpData);
        
        res.redirect('/admin/adminLogin')
      }

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