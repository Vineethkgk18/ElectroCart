const express = require('express');
const router = express.Router();
const userHelpers = require('../../helpers/userHelpers/userHelpers')
const categoryHelpers = require('../../helpers/userHelpers/categoryHelpers')
const productHelpers = require('../../helpers/userHelpers/productHelpers')
const cartHelpers = require('../../helpers/userHelpers/cartHelpers')
const wishListHelpers = require('../../helpers/userHelpers/wishListHelpers')
const checkOutHelpers = require('../../helpers/userHelpers/checkOutHelpers')
const twilioHelpers = require('../../helpers/twilioHelpers')
const session = require('express-session');
const { NetworkContext } = require('twilio/lib/rest/supersim/v1/network');

module.exports ={
    getViewOrder:async(req,res)=>{
        try {
            let userId = req.session.user._id;
            let order = await userHelpers.getOrder(userId);
            res.render('userpages/viewOrderHistory',{users:true,order})
        } catch (error) {
            next(error)
        }
    },
    getViewOrderProducts:async(req,res)=>{
        try {
                userId = req.session.user._id;
                orderId = req.params.id;
                let orderItem= await userHelpers.getOrderProducts(userId,orderId)
                let orderProducts = orderItem[0].products;  
                res.render("userpages/userViewOrder",{orderProducts,orderId})
        } catch (error) {
                next(error)
        }    
    },
    postChangeOrderStatus:async(req,res)=>{
        try {
            let orderId = req.body.orderId;
            let orderStatus = await userHelpers.changeOrderStatus(orderId)      
            res.json({status:true})
        } catch (error) {
            next(error)
        } 
    },
    getOrderCancelled:(req,res)=>{
        try {
          res.render("userpages/userOrderCancelled")
        } catch (error) {
            next(error)
        }
    }
}