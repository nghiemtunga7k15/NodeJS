//Require Mongoose
const mongoose = require('mongoose');

//Định nghĩa một schema
const Schema = mongoose.Schema;

const add = new Schema({
	city : String
    })


const UserSchema = new Schema({
    name: String,
    gmail : String,
    password:String
	},{ versionKey: false });
const User = mongoose.model('users', UserSchema);
module.exports = User;