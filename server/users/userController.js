var User = require('./userModel.js');

module.exports = {

  getCurrentUser: function (req, res, next){
    console.log("logged in user: ", req.user);
    var user = req.user;
    res.send(user); 
  },

  getUser: function(req, res, next){
    User.find({fbId: req.body.id}, function (err, user){
      if(err){
        console.log(err);
      } else{
        if (!user ){
          console.log('no user');
        } else {
          console.log('yes user', user);
          res.json(user);
        }
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
