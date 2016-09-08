angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope,$ionicPopup) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.data = {};
  $scope.data.user = {};
  $scope.contacts = [];
  showAuth($scope,$ionicPopup);
  $scope.addContact = function() {addContact($scope,$ionicPopup);};
  $scope.call = function(userId) {call($scope,$ionicPopup,userId);};


})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});



function onCallEv($scope,$ionicPopup){
  $scope.peer.on('call', function(call) {
  var getUserMedia = navigator.webkitGetUserMedia;
  getUserMedia({video: false, audio: true}, function(stream) {

     onCallEvPopup($scope,$ionicPopup,call,stream);
    //call.answer(stream); // Answer the call with an A/V stream.
    /*call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
    });*/
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
});
}

function call($scope,$ionicPopup,userId){
  var getUserMedia = navigator.webkitGetUserMedia;
  getUserMedia({video: false, audio: true}, function(stream) {
    var call = $scope.peer.call(userId, stream);
    $scope.showAlert = function() {
      var alertPopup = $ionicPopup.alert({
        title: 'Call',
        template: 'wtih ' + call.peer,
        okText: 'End call',
        okType: 'button-assertive'
      });

      alertPopup.then(function(res) {
        call.close();
      });
    };


    /*call.on('stream', function(remoteStream) {
      // Show stream in some video/canvas element.
    });*/
  }, function(err) {
    console.log('Failed to get local stream' ,err);
  });
}



function showAuth($scope,$ionicPopup){

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.user.login">',
    title: 'Login',
    subTitle: '',
    scope: $scope,
    buttons: [
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.user.login) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            ///doLogin
              $scope.peer = new Peer($scope.data.user.login,{key: '4n29bbhg157mn29'});
              onCallEv($scope,$ionicPopup);
          }
        }
      }
    ]});
}

function addContact($scope,$ionicPopup){
  var myPopup = $ionicPopup.show({
    template: '<input type="text" ng-model="data.lastAddedContact">',
    title: 'Add contact',
    subTitle: 'Please enter contact username',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.lastAddedContact) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            $scope.contacts.push($scope.data.lastAddedContact);
          }
        }
      }
    ]
  });
}



function onCallEvPopup($scope,$ionicPopup,call,stream){
  $scope.showConfirm = function() {
  var confirmPopup = $ionicPopup.confirm({
    title: 'Incoming call',
    template: call.peer,
    cancelText: 'Decline',
    cancelType: 'button-assertive',
    okText: 'Answer',
    okType: 'button-balanced'
  });

  confirmPopup.then(function(res) {
    if(res) {
      call.answer(stream);
      ////////////////////////////////

      $scope.showAlert = function() {
        var alertPopup = $ionicPopup.alert({
          title: 'Call',
          template: 'wtih ' + call.peer,
          okText: 'End call',
          okType: 'button-assertive'
        });

        alertPopup.then(function(res) {
          call.close();
        });
      };
      ////////////////////////////////

    }
  });
};

}
