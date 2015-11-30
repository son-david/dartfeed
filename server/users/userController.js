var User = require('./userModel.js');

module.exports = {

  getCurrentUser: function (req, res, next){
    console.log("logged in user: ", req.user);
    var user = req.user;
    res.send(user); 
  },

  getUser: function(req, res, next){
    User.findOne({fbId: req.body.id}, function (err, user){
      if(err){
        console.log(err);
      } else{
        if (!user ){
          User.create({username: req.body.name, fbId: req.body.id})
            .then(function(user){
              res.json(user);
            });
        } else {
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
  },

  addCats: function(req, res, next) {
    User.findOne({fbId: req.body.id}, function (err, user){
      if (err) {
        console.log(err);
      } else {
        user.set('categories', req.body.categories);
        user.save();
        res.json(user);
      }
    })
  }
}
