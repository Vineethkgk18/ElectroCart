const dotenv = require('dotenv').config
require('dotenv').config();

const db= require('../config/connection')
const collection=require('../config/collections')


const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const serviceId = process.env.TWILIO_SERVICE_SID



const client = require('twilio')(accountSid, authToken,serviceId);

module.exports = { 
    sendSms:(userData) =>{
        return new Promise(async (resolve, reject) => {
            let res = {}
            await client.verify.services(serviceId).verifications.create({
                to: `+91${userData.phone}`,
                channel: "sms"
            }).then((reeee) =>{
                res.valid = true;
                resolve(res)
                console.log(reeee);
            }).catch((err) => {
                console.log(err);
            })
        })
    },

    otpVerify: (otpData, userData) => {
        console.log(otpData);
        console.log(userData);
       //let phone = 7012142533
       //to: `+91${userData.phone}`,
        return new Promise(async (resolve, reject) => {
            await client.verify.services(serviceId).verificationChecks.create({
                to: `+91${userData.phone}`,
                code: otpData.otp
            }).then((verifications) => {
                console.log(verifications);
                resolve(verifications.valid)
            })
        })
    }

}


