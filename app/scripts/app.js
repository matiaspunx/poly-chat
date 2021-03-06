(function(document) {
'use strict';

  var app = document.querySelector('#app');
  var profilePic, profileName;

  app.items = [];
  app.channels = [];
  app.firebaseURL = 'https://chat-edr.firebaseio.com/';
  app.firebaseProvider = 'google';

  /* Funcion updateItems() para actualizar el chat cuando hay un cambio en la base de datos */
  app.updateItems = function(snapshot) {
    this.items = [];

    snapshot.forEach(function(childSnapshot) {
      var item = childSnapshot.val();
      var UTCTime = new Date(item.time);

      item.time = UTCTime.getHours() + ":" + (UTCTime.getMinutes() < 10?'0':'') + UTCTime.getMinutes();
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June","July", "Aug", "Sept", "Oct", "Nov", "Dec"];
      item.date = UTCTime.getUTCDate() + " " + monthNames[UTCTime.getUTCMonth()] + " " + UTCTime.getUTCFullYear();
      
      this.push('items', item);
    }.bind(this));

    function scrollToBottom(){
      document.getElementById('mainContainer').scrollTop = 999999999999999999999999;
    }
    setTimeout(scrollToBottom, 0); 
  };

  app.showChannels = function(snapshot) {
    this.channels = [];
    snapshot.forEach(function(childSnapshot) {
      var channel = childSnapshot.key();
      this.push('channels', channel);
    }.bind(this));  
  };  

  app.addItem = function(event) {
    event.preventDefault(); // No enviamos el formulario! :)

    if (app.newItemValue.length > 0){
      var currentTime = (new Date()).getTime();
      this.ref.push({
        text: app.newItemValue,
        img: profilePic,
        username: profileName,
        time: currentTime
      });
      app.newItemValue = '';        
    }
  };

  /* Función que captura el evento del login y nos nuestra un mensaje si hay un error (medio dificil que pase si estamos usando google) */
  app.onFirebaseError = function(event) {
    this.$.errorToast.text = event.detail.message;
    this.$.errorToast.show();
  };

  /* Funcion que captura el evento del login y nos rescata la información del usuario, nombre y avatar */
  app.onFirebaseLogin = function(e) {
    profilePic = e.detail.user.google.profileImageURL;
    profileName = e.detail.user.google.displayName;
    var chatURL = 'https://chat-edr.firebaseio.com/chat/';
    this.ref = new Firebase(chatURL);
    this.ref.on('value', function(snapshot) {
      app.showChannels(snapshot);
    });
  };

  app.changeChannel = function(value){
    var pages = document.querySelector('iron-pages');
    pages.selected = 1; // Cambiamos a la segunda pagina
    var chatURL = 'https://chat-edr.firebaseio.com/chat/' + (value.target.textContent).substring(1);
    this.ref = new Firebase(chatURL);
    this.ref.on('value', function(snapshot) {
      app.updateItems(snapshot);
    });
    app.thisIsDog = value.target.textContent;
  }

  app.backChannel = function(){
    var pages = document.querySelector('iron-pages');
    pages.selected = 0;   
  }

  app.createChannelReal = function(){
    var chatURL = 'https://chat-edr.firebaseio.com/chat/escuela-dev-rock/';
    this.ref = new Firebase(chatURL);
    var currentTime = (new Date()).getTime();
    this.ref.push({
      text: '¡Bienvenidos!',
      img: profilePic,
      username: profileName,
      time: currentTime
    });
    console.log(currentTime);
  }

  app.createChannel = function(){
    alert("Muy pronto");
  }

})(document);