var User = require('./userModel.js');

module.exports = {

  getCurrentUser: function (req, res, next){
    console.log("logged in user: ", req.user);
    var user = req.user;
    res.send(user); 
  },

  getUser: function(req, res, next){
    console.log(req.body);
    User.find({_id: req.params.user_id}, function (err, user){
      if(err){
        console.log(err);
      } else{  
        res.json(user);
      }
    });
  },

  getAllUsers: function(req, res, next){
    User.find(null, function (err, users){
      if(err){
        res.send(err);
      }  
      res.json(users);
    });
  }
}
