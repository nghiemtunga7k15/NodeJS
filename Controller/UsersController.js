const User = require('../Collection/user.js');
function demo(){
	return new Promise((resolve,reject)=>{
		User.find().exec((err,data)=>{
			if(err){
				reject('Lỗi')
			}else{
				resolve(data)
			}
		})
	})
}
module.exports = {

	indexCategory: function(req, res, next) {
  		res.render('BE/User/listCategory', { title: 'User' });
	},

	create_user:function(req, res, next) {
		res.render('FE/dky', { title: 'Create User' });	
	},

	handle_create: function(req, res, next) {
		var body = {
			name : req.body.name,
			gmail : req.body.gmail,
			password : req.body.password
		}
		let user =  new User(body);
		user.save((err,suc)=>{
			if(err) console.log(err);
			res.redirect('/login-user');
		})
	},

	login_user: function(req, res, next) {
		res.render('FE/login', { title: 'Login User' });	
	}


}