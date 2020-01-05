//file will handle the connection logic to the mongoDB database
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/Compass", { useNewUrlParser:true }).then(()=>{
  console.log("connection established with DB")
}).catch((e)=>{
  console.log("failed to connect. Reason:"+ e)
})

//to prevent deprication warnings
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

module.exports = {
  mongoose  
};