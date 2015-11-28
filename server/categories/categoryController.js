var Category = require('./categoryModel');
var User = require('../users/userModel.js');

module.exports = {
  getCategories: function (req, res, next){
    Category.find(function (err, cats){
      res.send(cats);
    });
  }, 

  updateUserCategories: function(req, res, next){
    //use req.user to save back the updates
    console.log("req.user in update cats ",req.user.id);
    User.findOne({_id: req.user.id}, function (err, user){
      if(err){
        res.send(err);
      } 
      // console.log(req.body.categories.category);
      user.categories.push({name: req.body.categories.category});
      // console.log(user.categories);
      user.save(function(err) {
        if (err) {
          res.send(err);
        }
        console.log(user); 
        res.status(201);
        res.json({ message: 'User updated!' });
      });
    });
  }
}


