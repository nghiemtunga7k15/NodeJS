
const md5 = require('md5');
var ojID = require('mongodb').ObjectID; 
const Admin = require('../Collection/admin.js');
const CSDL = require('../DB/connect.js');
var db = CSDL.getDB();
module.exports={


	indexCreate : function(req,res,next){
		res.render('BE/Admin/createAccount', { title: 'Create Account Admin'});
	},

	validateAccount : async function(req,res,next){
		let admin = new Admin();
		let err_name = '';
		let err_email = '';
		let err_phone = '';
		var err = [];
		await	Admin.find({},(errr,suc)=>{
			if(errr) console.log(errr);
			suc.filter(obj=>{
				if(obj.email == req.body.email){
					err.push('Email đã được sử dụng');
					err_email='Email đã được sử dụng';
				}
			})
		})
		if(!req.body.name.match(/[a-zA-Z]/)){
			err.push('Name Invalid');
			err_name = 'Name Invalid';
		}
		if(!req.body.phone.match(/^(03|09).[0-9]{5,8}$/)){
			err.push('Phone Invalid');
			err_phone = 'Phone Invalid';
		}
		if(!req.body.email.match(/^([a-zA-Z0-9]{10,20})+@+(gmail|email)+.(com|vn)$/)){
		// if(!req.body.email.match(/[a-zA-Z0-9]/)){
			err.push('Email Invalid');
			err_email = 'Email Invalid';
		}
		if(err.length > 0){
			res.render('BE/Admin/createAccount', { title: 'Create Account Admin' ,
				err_name :err_name,
				err_email : err_email,
				err_phone : err_phone
			});
			// console.log('Ở lại')
		}else{
			// console.log('Đi qua')
			// 
			next();
		};

	},
	handle_create_admin: function(req,res,next){
		var body = {
			name : req.body.name,
			email : req.body.email,
			password : md5(req.body.password),
			phone : req.body.phone,
			address : req.body.address,
		}
		let admin =  new Admin(body);
		admin.save((err,suc)=>{
			if(err) console.log(err);
			res.redirect('/admin/login');
		})
		
	},
	validate_login_admin : function(req,res,next){
		let err_email = '';
		var err = [];
		if(!req.body.email.match(/^([a-zA-Z0-9]{10,20})+@+(gmail|email)+.(com|vn)$/)){
		// if(!req.body.email.match(/[a-zA-Z0-9]/)){
			err.push('Email Invalid');
			err_email = 'Email Invalid ! Nhập lại';
		}
		if(err.length > 0){
			res.render('BE/Admin/login', { title: 'Login Admin' ,
				err_email : err_email
			});
		}else{
			next();
		};
	},
	indexLogin : function(req,res,next){
		res.render('BE/Admin/login', { title: 'Login Admin' })
	},
	
	handle_login_admin :  function(req,res,next){
		let password = md5(req.body.password)
		let admin= db.collection('admins');
		 admin.find({password:password,email:req.body.email},(err,data)=>{
			data.forEach(obj=>{
				res.cookie('IdUser', obj._id);
				req.session.info_admin = obj;
				res.redirect('/') 
			})
		})	
	},
	Auth : async function(req,res,next){
		if(!req.cookies.IdUser){
			res.redirect('/admin/login');
		}else{
			next();
		}
	},
	
}