
//const mongoClient=require('mongodb').MongoClient  
const {MongoClient} = require('mongodb');
//const mongoClient=MongoClient

require('dotenv').config()

const state={
    db:null
}


module.exports.connect=function(done){
    const url=process.env.db;
    const dbname='Electrocart'
    //mongoClient.connect(url,{useNewUrlParser:true},(err,data)=>{
        MongoClient.connect(url,{useNewUrlParser:true},(err,data)=>{
        if(err) {
            console.log(err);
            return done(err)
        }
        else{
            state.db=data.db(dbname)
            done()
        }
    })
}

module.exports.get=function(){
    return state.db
} 

// module.exports = get();

// function get(){
//     return state.db
// }

