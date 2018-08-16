const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const exerciseSchema = new Schema({
//"_id": mongoose.Schema.Types.ObjectId,

"description":{
"type":String,
"required":true
},

"duration":{
"type":Number,
"default":0
},

"date":{
"type":Date,
"default":Date.now
}
});

module.exports = mongoose.model("Exercise" , exerciseSchema);
