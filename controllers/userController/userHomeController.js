const userHelpers = require('../../helpers/userHelpers')
const loginHelpers = require('../../helpers/userHelpers/loginHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
const cartHelpers = require('../../helpers/userHelpers/categoryHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')

const session = require('express-session');

module.exports={
    renderHome: async (req, res, next)=> {
        let userId=req.session.user._id
        let user = req.session.user;
        //console.log("ZZZZZZZZZZZZZZ_session", req.session);
        let cartCount = await userHelpers.getCartCount(userId)
        let products = await productHelpers.getProducts();
        let category = await categoryHelpers.getCategory();
        let wishListCount = await userHelpers.wishListCount(userId)
       // console.log("AAAAAAAAAA____cartCount",cartCount)        
            res.render('userpages/userHome',{users:true,orderSuccess:true,user,products,category,cartCount,wishListCount})
    },
    getUserLogin: (req,res)=>{
        if(req.session.loggedIn)
        {
            //console.log("ZZZZZZZZZZZZZZZZ_____req_session", req,session);
            res.redirect('/')
        }else{
            res.render('userpages/user-login',{users:true,orderSuccess:true})//,{"loginError": req.session.loginError})
            req.session.loginError = false;
        }
    },
    postUserLogin: (req,res) => {
        loginHelpers.doLogin(req.body).then((response)=>{
          if(response.status){
            req.session.loggedIn=true;
            req.session.user=response.user
              if(req.session.cart){
                res.redirect('/addToCart')
              }else{
                res.redirect('/')
              }
          }else{
            req.session.loginError = true;
            res.redirect('/login')
          }
        })
      },
      getUserLogOut: (req,res)=>{
        req.session.loggedIn = null
        req.session.loggedIn=false
        req.session.user = null
        res.redirect('/')
    },


    getUserSignUp: (req,res) => {
        res.render('userpages/user-signup',{users:false,})
    },

    postUserSignUp: async (req,res) => {
        req.session.signUpData = req.body;
        let userEmail = await loginHelpers.verifyEmail(req.body.Email);
        if(userEmail){
             console.log(" ERROR User Exists")
             res.redirect('/signup')
        }
        else{
         let userData = req.session.signUpData;
         let sms = await twilioHelpers.sendSms(req.session.signUpData);
          res.render('userpages/user-otppage')
        }
       },
       postSignUpOtp: async(req,res)=>{
        let userData = req.session.signUpData;
        let otpData = req.body;
        let veryOtp = await twilioHelpers.otpVerify(otpData,userData)
        //console.log("veryOtp:",veryOtp);
      if(veryOtp){
          loginHelpers.doSignup(userData).then((response) => {
                res.redirect('/login')
        })
      }else{
        console.log("OTP verification failed")
        res.redirect('/signup')
      }
    }     



}