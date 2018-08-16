const mongoose = require("mongoose");
const shortid = require("shortid");

const Schema = mongoose.Schema;


const userSchema = new Schema({
"_id":{
"type":String,
"default":shortid.generate
},

"username":{
"type":String,
"required":true
},

"exercises":{
"type": [mongoose.Schema.Types.ObjectId],
"ref":"Exercise",
"default":[]
}
});

module.exports = mongoose.model("User" , userSchema);