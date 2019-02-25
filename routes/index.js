const express = require('express');
const router = express.Router();
// const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const CSDL = require('../DB/connect.js');
const User = require('../Collection/user.js');
const controller = require('../Controller/CategoryController.js');
const multer  = require('multer');
const userController = require('../Controller/UsersController.js');

const Category = require('../Collection/categorys.js');

const adminController = require('../Controller/AdminController.js');


const indexController = require('../Controller/IndexController.js');


const passport = require('passport');

const localStrategy = require('passport-local').Strategy;


var ojID = require('mongodb').ObjectID; 



/*Upload File*/


var storage = multer.diskStorage({
		  destination: function (req, file, cb) {
		  	// Đường dẫn lưu File
		    cb(null, './public/uploads')
		  },
		  filename: function (req, file, cb) {
		    cb(null,file.originalname)
		  }
		})

var upload = multer({ storage: storage});





/* GET home page. */
const db = CSDL.getDB();

router.get('/',adminController.Auth, function(req, res, next) {
  	res.render('BE/index', { title: 'Dashboard' , infoAdmin:req.session.info_admin});
});

router.get('/off', function(req, res, next) {
  	req.session.destroy();
  	res.clearCookie('IdUser');
  	res.redirect('/admin/login');
});



router.get('/create-user',userController.create_user);

router.post('/create-user',userController.handle_create);
/*-------------------CATEGORY---------------------------*/


router.get('/category',adminController.Auth, controller.indexCategory);

router.get('/create-category',adminController.Auth , controller.create_category);

router.post('/create-category',controller.validate,controller.handle_cat_name,controller.handle_create);



/*-----------------------PRODUCT-----------------------------*/
router.get('/list-product',adminController.Auth, controller.list_product);

router.get('/create-product',adminController.Auth , controller.create_product);

// router.post('/create-product',upload.single('image'),controller.validate_product);
router.post('/create-product',upload.single('image'),controller.validate_product , controller.handle_create_product);


router.get('/update-product/:slug/:id',adminController.Auth , controller.update_product);

router.post('/update-product/:slug/:id', controller.handle_update_product);

router.get('/view/:slug/:id',adminController.Auth ,  controller.view_product);

router.get('/delete-product/:slug/:id',adminController.Auth , controller.delete_product);


router.get('/search-result',adminController.Auth, controller.resultSearch);


router.get('/admin/login',adminController.indexLogin);

router.post('/admin/login',adminController.validate_login_admin , adminController.handle_login_admin);

router.get('/admin/create', adminController.indexCreate);

router.post('/admin/create',adminController.validateAccount , adminController.handle_create_admin);

router.get('/admin',adminController.Auth);





/*---------------------HOME------------------------------*/
router.get('/home', indexController.index );

router.get('/pa/:page', function(req, res, next) {


    var perPage = 2
    var page = req.params.page || 1

    var tong =0;
    Category
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, products) {
           Category.find( { "product.nameProduct": { $in: [ /^[a-zA-Z]/ ] } },(err,data)=>{
				if(err) console.log(err)
					data.forEach(obj=>{
					tong += (obj.product.length)
				})
			 		res.render('FE/index' ,{ title: 'Home' , 
			 		    data: data,
			 		    current: page,
    					pages: Math.ceil(tong / perPage)
                    });
			})
        })
  

})
router.get('/create-user',userController.create_user);

router.post('/create-user',userController.handle_create);

router.get('/login-user',userController.login_user);
/*------------------DETAIL-----------------------*/
router.get('/detail/:slug',indexController.detail);  



router.post('/login-user', 
  passport.authenticate('local',
   	{ 
	    failureRedirect: '/login-user',  //nếu check không đúng thì redirect về link này
	    successRedirect: '/home'
	}
));
passport.use(new localStrategy(
     (username, password, done) => { //các tên - name trường cần nhập, đủ tên trường thì Done 
         if(username == 'user') { //kiểm tra giá trị trường có name là username
             if (password == 12345) { // kiểm tra giá trị trường có name là password
                 return done(null, username); //trả về username
             } else {
                 return done(null, false); // chứng thực lỗi
             }
         } else {
             return done(null, false); //chứng thực lỗi
         }
     }
))
passport.serializeUser((username, done) => {
    done(null, username);
})

module.exports = router;
