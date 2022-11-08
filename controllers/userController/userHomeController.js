const userHelpers = require('../../helpers/userHelpers/userHelpers')
const loginHelpers = require('../../helpers/userHelpers/loginHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
const cartHelpers = require('../../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../../helpers/userHelpers/checkOutHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')

const session = require('express-session');

module.exports={
    renderHome: async (req, res, next)=> {
          try {
              let userId=req.session.user._id
              let user = req.session.user;        
              let cartCount = await cartHelpers.getCartCount(userId)
              let products = await productHelpers.getProducts();
              let banner = await productHelpers.getBanner();
              let category = await categoryHelpers.getCategory();
              let wishListCount = await wishListHelpers.wishListCount(userId)      
              res.render('userpages/userHome',{users:true,orderSuccess:true,user,products,category,cartCount,wishListCount,banner})
          } catch (error) {
                next(error)
          }
    },
    getUserLogin: (req,res)=>{
          try {
                if(req.session.loggedIn)
                {            
                    res.redirect('/')
                }else{
                    res.render('userpages/userLogin',{users:true,orderSuccess:true})//,{"loginError": req.session.loginError})
                    req.session.loginError = false;
                }
          } catch (error) {
                next(error)
          }
    },
    postUserLogin: (req,res) => {
        try {
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
        } catch (error) {
          next(error)
        }
    },
    getUserLogOut: (req,res)=>{
          try {
            req.session.loggedIn = null
            req.session.loggedIn=false
            req.session.user = null
            res.redirect('/')
          } catch (error) {
            next(error)
          }
    },

    getUserSignUp: (req,res) => {
          try {
                res.render('userpages/userSignup',{users:false,})
          } catch (error) {
            next(error)
          }
    },

    postUserSignUp: async (req,res) => {

      try {
            req.session.signUpData = req.body;
            let userEmail = await loginHelpers.verifyEmail(req.body.Email);
            if(userEmail){
                console.log(" ERROR User Exists")
                res.redirect('/signup')
            }
            else{
            let userData = req.session.signUpData;
            let sms = await twilioHelpers.sendSms(req.session.signUpData);
              res.render('userpages/userOtppage')
            }
      } catch (error) {
        next(error)
      }
    },

    postSignUpOtp: async(req,res)=>{
      try {
            let userData = req.session.signUpData;
            let otpData = req.body;
            let veryOtp = await twilioHelpers.otpVerify(otpData,userData)        
            if(veryOtp){
                loginHelpers.doSignup(userData).then((response) => {
                res.redirect('/login')
                })
            }else{
                //console.log("OTP verification failed")
                alert(" OTP verification failed ")
                res.redirect('/signup')
            }
      } catch (error) {
            next(error)
      }
   
    }     
}