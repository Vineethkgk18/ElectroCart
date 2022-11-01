
const mongoClient=require('mongodb').MongoClient  
//const assert = require('assert');
const state={
    db:null
}

module.exports.connect=function(done){
    //const url= 'mongodb://localhost:27017'
       
    const url= 'mongodb+srv://8714469938:04672284965@cluster0.ibfbseb.mongodb.net/Electrocarts'

    const dbname='Electrocarts'
    mongoClient.connect(url,{useNewUrlParser:true},(err,data)=>{
        if(err) {
            return done(err)
            console.log(err);
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
