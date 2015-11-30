
angular.module('starter.controllers', ['ngOpenFB', 'app.services'])

.controller('AppCtrl', ['$scope','$http', '$ionicModal', '$timeout', 'ngFB', '$location', '$state', '$ionicHistory','Helper',  function($scope, $http, $ionicModal, $timeout, ngFB, $location, $state, $ionicHistory, Helper) { 

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.me = {};
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email, user_friends'}).then(
        function (response) {

          ngFB.api({path: '/me'})
            .then(function (res) {
              angular.extend($scope.me, res);
            }, function( err ) {
              console.log(err);
          });
          ngFB.api({
            path: '/me/picture',
            params: {
                redirect: false,
                height: 50,
                width: 50
            }
            }).then(function( res ) {
              angular.extend($scope.me, {picture: res.data.url});
            }).then(function() {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              Helper.store($scope.me);

              $location.path('/app/profile');
            }).then(function(){ //user info to server
              $http({
                url: 'http://localhost:8000/user', 
                method: 'POST',
                data : $scope.me
              }).then(function(res) {
                console.log('(controllers.js) this is user data as exists on server:', res.data);
              });
            });
        });
  };

  $scope.fbLogOut = function () {
    ngFB.logout();

  };
}])

.controller('UserController', ['$scope', '$http', '$location', '$state','Helper', 'Feed',  function($scope, $http, $location, $state, Helper, Feed) {

  $scope.me = Helper.me[0];

  $scope.addCatNav = function () {
    $state.go('app.addCat');
  }
  $scope.passCategory = function(cat) {
    Helper.catStore(cat);
  }
  $scope.getCat = function() {
    Feed.getCategories().then( function (categories) {
      $scope.catList = categories.data.map( function (cat) {
        return {
          name: cat.name,
          checked : false
        };
      });
      // $scope.catListwArticles = categories.data;
      // console.log('$scope.catListwArticles',$scope.catListwArticles);
      categories.data.forEach(function(category) {
        $scope[category.name] = []
        category.articles.forEach(function(article){
          $scope[category.name].push(article);
        })
      })

      $http({
        url: 'http://localhost:8000/user', 
        method: 'POST',
        data : $scope.me
      }).then(function(res) {
        res.data.categories.forEach(function(category) {
          $scope.catList.forEach(function(item) {
            if (item.name === category) {
              item.checked = true;
            }
          });
        })
      });

      console.log("$scope.catList after retrieving user categories from server", $scope.catList)

    });
  }
  $scope.getCat();

  $scope.saveCats = function () {
    console.log('$scope', $scope.catList);
    var userCategories = [];
    $scope.catList.forEach(function(category) {
      if (category.checked) {
        userCategories.push(category.name);
      }
    })
    Feed.updateUserCategories($scope.me.id, userCategories)
      .then(function(res) {
        console.log('user after categories', res.data);
        $location.path('/app/profile');
      });
      

  }

}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ArticlesCtrl', ['$scope', '$sce', '$stateParams', 'Feed', 'Helper', function($scope, $sce, $stateParams, Feed, Helper) {

  $scope.showContainer = true;

  $scope.getArticlesForUser = function (){
    Feed.getArticlesForUser()
      .then(function (articles){
        console.log(articles)
        $scope.articles = articles;

      });
  }
  $scope.getArticlesForCat = function(){
    $scope.passed = $scope[Helper.catHolder[0]]
    return $scope.passed;
  }
  $scope.displayCategoriesForUser = function () {
    Feed.getCategories().then( function (categories) {
      $scope.categories = categories;
      $scope.urlListForIframe = categories.data[3].articles.map(function(el){
        return el.linkURL;
      });
      $scope.catList = categories.data.map( function (cat) {
        return cat.name;
      });
      $scope.categories.data.forEach(function(category) {
        console.log('here' , category.name);
        $scope[category.name] = []
        category.articles.forEach(function(article){
          $scope[category.name].push(article);
        })
      })
      console.log("$scope['GamesTech']",$scope['GamesTech'])
    });
  }
  $scope.getIframeSrc = function(url){
    $sce.trustAsResourceUrl(url);
    $sce.trustAsUrl(url);
    return url;
  }
  $scope.createIframe = function(element,location){
    $scope.showContainer = false;
    
    var theIframe = document.createElement("iframe");
    theIframe.src = location;
    theIframe.width = "90%";
    theIframe.height = "100%";
    theIframe.scrolling = 'yes';
    var result = document.getElementsByClassName("holder")[0];
    $sce.trustAsResourceUrl(location)
    result.appendChild(theIframe);
    // var test = document.getElementsByClassName("articleContainer")[0];
    // test.innerHTML = '';
  }
  $scope.getArticlesForUser();
  $scope.displayCategoriesForUser();
}]);
