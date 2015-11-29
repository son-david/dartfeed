var mongoose = require('mongoose');

var UserCategorySchema = new mongoose.Schema({
  name: String,
}, {_id: false});

var UserProfileSchema = new mongoose.Schema({
 username: String,
 fbToken: String,
 fbId: Number, 
 categories: [UserCategorySchema]
});

module.exports = mongoose.model('UserProfiles', UserProfileSchema);
