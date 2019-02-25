const Category = require('../Collection/categorys.js');
let date = new Date();
let day = date.getDate();
let month = date.getMonth()+1;
let year = date.getFullYear();

var ojID = require('mongodb').ObjectID; 
const CSDL = require('../DB/connect.js');
var db = CSDL.getDB();


module.exports = {
	/*------------------------Category----------------*/
		indexCategory: function(req, res, next) {
			let getCategory =  async() =>{
				try{
					let category = await Category.find().exec();
					let sumCat = category.length;
	  				res.render('BE/Category/listCategory', { title: 'Category' 
	  					,category:category,
	  					sumCat:sumCat,
	  					 infoAdmin:req.session.info_admin
	  				});
				}catch(err){
					console.log(err)
				}
			}
			getCategory();
	  		
		},

		create_category:function(req, res, next) {
	  		res.render('BE/Category/create', { title: 'Create Category', day:day,month:month,year:year,infoAdmin:req.session.info_admin});
		},

		handle_create: function(req, res, next) {
			let category = new Category(req.body);
			let categoryIndex= db.collection('categorys');
			categoryIndex.dropIndexes();
			category.save(function(err) {
		        if (err)
		           console.log(`${err} Lỗi`);
		    });
		    res.redirect('/category')
		},
		handle_cat_name:async function(req, res, next) {
			var err = [];
			await Category.find({}).then(data=>{
				 data.forEach(obj=>{
					if(obj.name == req.body.name){
						err.push('Lỗi');		
					}

				})
			})
			console.log(err.length)
			console.log(err)
			if(err.length > 0){
				res.render('BE/Category/create', { title: 'Create Category', 
										day:day,month:month,year:year,
										infoAdmin:req.session.info_admin,
										err : 'Name đã tồn tại'
									});
			}else{
				next();
			}
			
		},

		validate:function(req,res,next){
			var err = [];
			let errName = '';
			let errAuthor = '';
			if(!req.body.name.match(/[a-zA-Z]/)){
				// Nếu Req.body.name không thỏa mãn thì gán ErrName và thông báo 
	 			errName = 'Name Invalid';
	 			// Dùng để Đếm lỗi
	 			err.push('Name Invalid');
		 	}
		 	if(!req.body.author.match(/[a-zA-Z]/)){
		 		// Nếu Req.body.errauthor không thỏa mãn thì gán errAuthor và thông báo 
		 		errAuthor = 'Author Invalid';
		 		// Dùng để Đếm lỗi
	 			err.push('Author Invalid');
		 	}
		 	if(err.length > 0){
		 		res.render('BE/Category/create',
			 		{ 
			 		 	title: 'Create Category', 
			 			err:err, 
			 			day:day,
			 			month:month,
			 			year:year,
			 			errAuthor:errAuthor,
			 			errName:errName,
			 			infoAdmin:req.session.info_admin
			 		});
		 	}else{
		 		next();
		 	}
		},

	/*------------------------Product----------------*/
	
	create_product:function(req, res, next) {
		let getCategory =  async() =>{
			try{
				let category = await Category.find().exec();
				console.log(category.length)
  				res.render('BE/Category/product', { title: 'Create Product',
  				 day:day,month:month,year:year,category:category,
  				 infoAdmin:req.session.info_admin});
			}catch(err){
				console.log(err)
			}
		}
		getCategory();
	},

	handle_create_product:function(req, res, next) {
		
		let body = {
			nameProduct:req.body.nameProduct,
			price:req.body.price,
			description:req.body.description,
			status:req.body.status,
			author:req.body.author,
			image : req.file.originalname
		}
		let id = req.body.category_name;
		let xl  = async ()=>{
			await	Category.find().exec((err,data)=>{
			if(err) console.log('Data Not Found ');
				data.filter(obj=>{
					if(obj._id == id){
						obj.product.push(body);
						obj.save(function (err, cat) {
					    if (err) console.log('Err');
						 	res.redirect('/list-product')
						});
						}
					})
				
				})
			}
		xl()
	},

	validate_product: async function(req, res, next) {
		var err = [];
		let categoryDB= db.collection('categorys');
		let id = ojID(req.body.category_name);
		let nameProduct = req.body.nameProduct;
		let category = await Category.find().exec();
		await	categoryDB.find({_id:id}).forEach(data=>{
				
				data.product.filter(obj=>{
					if(obj.nameProduct == nameProduct){
						err.push('Lỗi')
					}
					
				})

		})
		
		if(err.length > 0){
			res.render('BE/Category/product', { title: 'Create Product',
  				 day:day,month:month,year:year,
  				 category:category,
  				 infoAdmin:req.session.info_admin,
  				 errValidateName:'Product này đã tồn tại'
  				});
		}else{
			next();
		}
		
	},

	list_product:function(req, res, next) {
		let xl  = async ()=>{
			await	Category.find().exec((err,data)=>{
			if(err) handleError(err);
				// console.log(data)
				res.render('BE/Category/listProduct', { title: 'Danh sách Product',data:data,infoAdmin:req.session.info_admin});
			}
		)}
		xl()
	},

	delete_product:function(req, res, next) {
		let id = ojID(req.params.id)
		let slug = req.params.slug;
		let category= db.collection('categorys');
		category.update({_id:id},{$pull:{product:{slug:slug}}},(err,suc)=>{
			if(err) console.log('Delete Thất Bại');
			res.redirect('/list-product');
		}) 
	},

	update_product:function(req, res, next) {
		let id = ojID(req.params.id)
		let slug = req.params.slug;
		
		let category= db.collection('categorys');
		
		category.find({_id:id}).forEach(data=>{
	 		data.product.filter(pro=>{
	 			if(pro.slug == slug){
	 				res.render('BE/Category/editProduct', { title: `Edit ${pro.nameProduct}`,
	 				pro:pro ,
	 				id : id,
	 				infoAdmin:req.session.info_admin
	 			});
	 			}
	 		})
		 })
		
	},


	handle_update_product:function(req, res) {
		console.log(req.body)
		let id = ojID(req.params.id)
		let slug = req.params.slug;
		let category= db.collection('categorys');
		category.find({_id:id}).forEach(data=>{
	 		data.product.filter(obj=>{
	 			if(obj.slug == slug){
	 				let location =  data.product.indexOf(obj);
	 				let nameProduct = `product.${location}.nameProduct`;
	 				let description = `product.${location}.description`;
	 				let price = `product.${location}.price`;
	 				let status = `product.${location}.status`;
	 				category.update(
						{_id : id},
						{ $set:
					      {
					       [nameProduct]:req.body.nameProduct,
					       [description]:req.body.description,
					       [price]:req.body.price,
					       [status]:req.body.status
					      }
			   			}
					,(err,suc)=>{
						if(err) throw err
						res.redirect('/list-product');
					})
	 			}
	 		})
		 })
	},

	view_product:function(req, res, next) {
		let id = ojID(req.params.id)
		let slug = req.params.slug;
		let category= db.collection('categorys');
		
		category.find({_id:id}).forEach(data=>{
	 		data.product.filter(pro=>{
	 			if(pro.slug == slug){
	 				res.render('BE/Category/viewProduct', { title: ` ${pro.nameProduct}`,pro:pro,infoAdmin:req.session.info_admin});
	 			}
	 		})
		 })
	},
	resultSearch:function(req, res, next) {
  		let nameSearch = req.query.name;
  		let category= db.collection('categorys');
  		category.find({"product.nameProduct":{$regex:nameSearch , $options: 'i'}},(err,data)=>{
  			if(err) console.log('Lôi');

  			data.forEach(obj=>{
  				console.log(obj)
  				console.log(obj.product)
  				res.render('BE/Category/resultSearch', { title: `Result Search `,
  					infoAdmin:req.session.info_admin 
  					, results : obj.product
  				});

  			})
  		})
  	

  	}







	
}
// Kếtp