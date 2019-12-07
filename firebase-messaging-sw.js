importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-app.js');// firebase app
importScripts('https://www.gstatic.com/firebasejs/7.5.0/firebase-messaging.js');// firebase sdk messaging

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCzVP73ThClIelou02k9GoTmTsXIKgMJwY",
  authDomain: "mpwa-submission-3.firebaseapp.com",
  databaseURL: "https://mpwa-submission-3.firebaseio.com",
  projectId: "mpwa-submission-3",
  storageBucket: "mpwa-submission-3.appspot.com",
  messagingSenderId: "321256275545",
  appId: "1:321256275545:web:573b950704af5b6bae7b48",
  measurementId: "G-VNFVRL70SV"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// Initialize Messaging
const messaging = firebase.messaging();

// Set background message handler
messaging.setBackgroundMessageHandler(function(payload) {
  console.log(payload);
  if (payload) {
    var title = payload.data.title;
    var options = {
      icon: payload.data.icon,
      badge: payload.data.badge,
      body: payload.data.body
    }
  } else {
    var title = 'CURL';
    var options = {
      icon: 'icon.png',
      badge: 'icon.png',
      body: 'Default push message CURL.'
    }
  }
  return self.registration.showNotification(title, options);
})