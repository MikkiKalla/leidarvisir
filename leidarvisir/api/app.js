const express = require("express");
const app = express();
const port = "3000"


app.get("/", (res, req)=>{
  res.send("hello world");
})
app.listen(port, ()=>{
  console.log("server is listening on port:: "+ port);
  
})