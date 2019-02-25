const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
var mongoosePaginate = require('mongoose-paginate');
 // Tự động gennarate
mongoose.plugin(slug);


function format(date) {
	let day   = date.getDate();
  	let month = date.getMonth()+1;
  	let year  = date.getFullYear();
  	return day + '/' + month + '/' + year;
}

var CategorySchema = new Schema({
    name:{
    	type:String,
        require: true
    },
    author:{
    	type:String
    },
    slug:{ 
    	type: String, 
    	slug: "name",
    },
    product:[
                {
                    nameProduct:{ type:String},
                    slug:{type: String,  slug: "nameProduct"},
                    price:{type:Number},
                    description:{ type: String, },
                    status:{ type: Number}, 
                    image:{type:String},
                    author:{type:String},
                    date:{ type: Date,default:new Date}
                }
        ],
    date:{ 
    	type: Date,
    	default:new Date
    },
	},{ versionKey: false });
CategorySchema.plugin(mongoosePaginate);
var Category = mongoose.model('categorys', CategorySchema);
module.exports = Category;