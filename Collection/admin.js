const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var AdminSchema = new Schema({
    name:  String,
    email: String,
    password : String,
    phone:   Number,
    address: String,
    date: { type: Date, default: Date.now }
  },{ versionKey: false });
var Admin = mongoose.model('admins', AdminSchema);
module.exports = Admin;