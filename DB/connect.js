var mongoose = require('mongoose');
var url = 'mongodb://localhost:27017/mydb';
module.exports={
    getDB:function(){
      mongoose.connect(url);
      var db = mongoose.connection;
      return db;
    }
}