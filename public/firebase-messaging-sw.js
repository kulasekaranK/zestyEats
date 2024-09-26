importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({  
  apiKey: "",  
  authDomain: "",  
  projectId: "zesty-eats",  
  storageBucket: "zesty-eats.appspot.com",  
  messagingSenderId: "",  
  appId: "",  
  measurementId: ""  
});  
  

const messaging = firebase.messaging();
