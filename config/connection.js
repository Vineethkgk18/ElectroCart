
const mongoClient=require('mongodb').MongoClient  
//const env=
require('dotenv').config()
const state={
    db:null
}

module.exports.connect=function(done){
    //const url= 'mongodb://localhost:27017'
    //const url=process.env.db;  
   // const url= 'mongodb+srv://8714469938:04672284965@cluster0.ibfbseb.mongodb.net/?retryWrites=true&w=majority'
   //const url= 'mongodb+srv://8714469938:04672284965@cluster0.ibfbseb.mongodb.net/?retryWrites=true&w=majority'
    
    //const url='mongodb+srv://8714469938:password@cluster0.hesel1m.mongodb.net/test'
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
