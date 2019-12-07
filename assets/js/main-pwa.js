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

/* SERVICE WORKER & PUSH MANAGER */
if (!('serviceWorker' in navigator) && !('PushManager' in window)) {
  console.warn('[SW] Service Worker & Push Manager is NOT supported in this browser.');
} else {
  console.log('[SW] Service Worker & Push Manager IS supported.');
  registerSW(); // REGISTER SERVICE WORKER - RUN
  messaging.onMessage(function(payload) {
    console.log('[FCM PUSH NOTIFICATION] onMessage: ', payload);
  });
}

// REGISTER SERVICE WORKER
function registerSW() {
  return navigator.serviceWorker.register('/sw.js')
    .then(function(swReg) {
      console.log('[SW] Service Worker IS registered.', swReg);
      swRegistration = swReg;
      requestPermissionNotification();
    }).catch(function(error) {
      console.error('[SW] Service Worker NOT registered.', error);
    });
}

function requestPermissionNotification() {
  // Request permission messaging
  messaging.requestPermission()
  .then(function() {
    console.log('[FCM PUSH NOTIFICATION] Have permission');
    return messaging.getToken();
  })
  .then(function(token) {
    console.log('[FCM PUSH NOTIFICATION] Token for Send Message via CURL:', token);
  })
  .catch(function(error) {
    console.log('[FCM PUSH NOTIFICATION] Failed to get Token ', error);
  });
}
/* ./SERVICE WORKER & PUSH MANAGER  */
/* ./NOTIFICATION */