
const mongoClient=require('mongodb').MongoClient  

require('dotenv').config()
const state={
    db:null
}
module.exports.connect=function(done){
    //const url= 'mongodb://localhost:27017'
    const url=process.env.db;
    const dbname='Electrocart'
    mongoClient.connect(url,{useNewUrlParser:true},(err,data)=>{
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
