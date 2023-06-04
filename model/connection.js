const mongodb = require("mongodb").MongoClient;
let state = { db: null };
module.exports.connect = () => {
  try{
  let url = process.env.DATABASE;
  let dbname = "React";
  //connecting to the database
  mongodb.connect(url).then(data=>{
    state.db = data.db(dbname);
    console.log("connected to database");
  })
    
   
 
  }
  catch(err){
    // internal error response
    console.log(err.message);
  }
};
module.exports.get = () => state.db;
