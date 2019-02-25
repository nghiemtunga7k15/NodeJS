const Category = require('../Collection/categorys.js');
const Admin = require('../Collection/admin.js');
const CSDL = require('../DB/connect.js');
var db = CSDL.getDB();
module.exports={


	index : function(req,res,next){
		Category.find({}).exec((err,data)=>{
			if(err) console.log(err)
				console.log(data.length)
				res.render('FE/demo' ,{ title: 'Hoem',items:data});
		})
	},
	detail: async function (req,res,next) {
		Category.find({product: {$elemMatch: {slug:req.params.slug}}}).exec((err,data)=>{
			if(err) throw err;
			data.forEach(obj=>{
				obj.product.filter(dl=>{
					if(dl.slug == req.params.slug){
						res.render('FE/detail' ,{ title: 'Chi tiết',items:dl});
					}
				})
			})
		})
	}

	
	
}