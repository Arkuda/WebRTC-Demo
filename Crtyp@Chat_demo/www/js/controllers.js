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
  signaling.on('messageReceived', onMessageReceive);
  var duplicateMessages = [];

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});



function showAuth($scope,$ionicPopup){

  // An elaborate, custom popup
  var myPopup = $ionicPopup.show({
    template: '<div align="center">Login</div> <input type="text" ng-model="data.user.login"><br/><div align="center">Pass</div><input type="password" ng-model="data.user.password">',
    title: 'Login',
    subTitle: '',
    scope: $scope,
    buttons: [
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.data.user.login && !$scope.data.user.password) {
            //don't allow the user to close unless he enters wifi password
            e.preventDefault();
          } else {
            ///doLogin

            $scope.signaling = io.connect('http://webrtcdemo-cryp2chat.herokuapp.com/');

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

function call(isInitiator, contactName) {

      if(isInitiator){

      }else{
        
      }


      console.log(new Date().toString() + ': calling to ' + contactName + ', isInitiator: ' + isInitiator);

      var config = {
        isInitiator: isInitiator,
        turn: {
          host: 'turn:c2cdem.cloudapp.net:3478',
          username: $scope.data.user.name,
          password: $scope.data.user.password
        },
        streams: {
          audio: true,
          video: false
        }
      };

      $scope.session = new cordova.plugins.phonertc.Session(config);

      session.on('sendMessage', function (data) {
        signaling.emit('sendMessage', contactName, {
          type: 'phonertc_handshake',
          data: JSON.stringify(data)
        });
      });

      session.on('answer', function () {
        console.log('Answered!');
      });

      session.on('disconnect', function () {

      });

      session.call();
}



function onMessageReceive (name, message) {
  switch (message.type) {
    case 'answer':
        signaling.emit('sendMessage', name, {
          type: 'add_to_group',
          contacts: existingContacts,
          isInitiator: false
        });

      call(true, name);
      break;


    case 'phonertc_handshake':
      if (duplicateMessages.indexOf(message.data) === -1) {
        $scope.session.receiveMessage(JSON.parse(message.data));
        duplicateMessages.push(message.data);
      }

      break;

  }
}
