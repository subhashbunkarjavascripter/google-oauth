 const mongoose = require("mongoose");



 mongoose.connect("mongodb://127.0.0.1:27017/googleoauth");


 var userSchema = mongoose.Schema({
  username: String,
  name:String
 })

 module.exports = mongoose.model("user",userSchema);
