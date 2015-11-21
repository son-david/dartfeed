angular.module('app.services', [])
.factory('Feed', function ($http){

  var getUserProfile = function (){
    return $http({
      url: '/api/user', 
      method: 'GET'
    });
  }

  var getCategories = function (){
    return $http({
      url: '/api/categories', 
      method: 'GET'
    });
  }

  var updateUserCategories = function (category){
    console.log(category);
    return $http({
      url: '/api/categories', 
      method: 'PUT',
      data: {
        categories: {
          category: category.toString()
        }
      }
    });
  }

  var getArticlesForUser = function (){
    return $http({
      url: 'http://localhost:8000/api/articles', 
      method: 'GET'
    });
  }

  var test = function(){
    console.log('test');
  }

  return {
    getUserProfile: getUserProfile,
    getCategories: getCategories,
    updateUserCategories: updateUserCategories, 
    getArticlesForUser: getArticlesForUser,
    test: test
  }

})
.factory('Helper', function ($http){

  var me = [];

  var store = function (val) {
    me[0] = (val);
  }

  return {
    me : me,
    store : store
  }
});
