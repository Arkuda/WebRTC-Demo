

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
  $scope.peer.on('call', function(callObj) {
  console.log('call',callObj);
  navigator.webkitGetUserMedia({video: true, audio: true}, function(stream) {

     onCallEvPopup($scope,$ionicPopup,callObj,stream);
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
  navigator.webkitGetUserMedia({video: true, audio: true}, function(stream) {
    var callObj = $scope.peer.call(userId, stream);
    callObj.on('stream',function(RemoteStream){

      var audio = new Audio();
      audio.src = URL.createObjectURL(RemoteStream);
      audio.play();
    });
    //document.getElementById('audio').setAttribute('src',URL.createObjectURL(stream));
      var alertPopup = $ionicPopup.alert({
        title: 'Call',
        template: 'wtih ' + userId,
        okText: 'End call',
        okType: 'button-assertive'
      });

      alertPopup.then(function(res) {
        callObj.close();
      });


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
              $scope.peer = new Peer($scope.data.user.login,{key: '4n29bbhg157mn29',debug: 3});
              //$scope.peer = Peer($scope.data.user.login, {host: 'c2crtcdemo.herokuapp.com', port: 9000, path: '/myapp'}); //https://c2crtcdemo.herokuapp.com/
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



function onCallEvPopup($scope,$ionicPopup,callObj,stream){

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
      //document.getElementById('audio').setAttribute('src',URL.createObjectURL(stream));
      callObj.answer(stream);
      callObj.on('stream', function(RemoteStream) {
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
          var audio = new Audio();
          audio.src = URL.createObjectURL(RemoteStream);
          audio.play();
      });

      //$scope.audioStream = URL.createObjectURL(stream);
      ////////////////////////////////


        var alertPopupCall = $ionicPopup.alert({
          title: 'Call',
          template: 'wtih ' + callObj.peer,
          okText: 'End call',
          okType: 'button-assertive'
        });

        alertPopupCall.then(function(res) {
          callObj.close();
        });

      ////////////////////////////////

    }
  });

}
