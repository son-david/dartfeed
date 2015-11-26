
angular.module('starter.controllers', ['ngOpenFB', 'app.services'])

.controller('AppCtrl', ['$scope', '$ionicModal', '$timeout', 'ngFB', '$location', '$state', '$ionicHistory','Helper',  function($scope, $ionicModal, $timeout, ngFB, $location, $state, $ionicHistory, Helper) {

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


  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.fbLogin = function () {
    ngFB.login({scope: 'email, user_friends'}).then(
        function (response) {

          ngFB.api({path: '/me'})
            .then(function (res) {
              console.log('pizza');
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
              console.log('1',$scope.me);
              $location.path('/app/profile');
            });
        });
  };

  $scope.fbLogOut = function () {
    ngFB.logout();

  };
}])

.controller('UserController', ['$scope', '$state','Helper', function($scope, $state, Helper) {

  $scope.me = Helper.me[0];
  console.log('look', Helper.me);

  $scope.categories = [
    { title: 'MoneyTech', id: 1 },
    { title: 'SportsTech', id: 2 },
    { title: 'OtherTech', id: 3 },
    { title: 'OneMore', id: 4 },
    { title: 'Evenetually', id: 5 },
    { title: 'Replaced', id: 6 }
  ];
  $scope.addCatNav = function () {
    $state.go('app.addCat');
  }
}])

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ArticlesCtrl', ['$scope', '$sce', '$stateParams', 'Feed', function($scope, $sce, $stateParams, Feed) {

  $scope.getArticlesForUser = function (){
    Feed.getArticlesForUser()
      .then(function (articles){
        console.log(articles)
        $scope.articles = articles;
        
      });
  }

  $scope.displayCategoriesForUser = function () {
    Feed.getCategories().then( function (categories) {
      $scope.categories = categories;
      $scope.categoryList = categories.data.map(function(el){
        return el.name;
      })
      $scope.urlListForIframe = categories.data[0].articles.map(function(el){
        return el.linkURL;
      })
      $scope.urlListForIframe.forEach(function(url){
        $sce.trustAsResourceUrl(url);
      })
      console.log($scope.urlListForIframe);
    })
  }
  $scope.getIframeSrc = function(url){
    $sce.trustAsResourceUrl(url);
    $sce.trustAsUrl(url);
    return url;
  }
  $scope.createIframe = function(element,location){
    var theIframe = document.createElement("iframe");
    theIframe.src = location;
    var result = document.getElementsByClassName("holder")[0];
    console.log(result)
    $sce.trustAsResourceUrl(location)
    result.appendChild(theIframe);
  }
  $scope.test = $sce.getTrustedResourceUrl
  $scope.getArticlesForUser();
  $scope.displayCategoriesForUser();
}]);
