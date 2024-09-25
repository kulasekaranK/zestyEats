importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.3.1/firebase-messaging-compat.js');

firebase.initializeApp({  
  apiKey: "AIzaSyDm4uUkwNeXXpkwFRQgj9I6NG6ayxKw9Jo",  
  authDomain: "zesty-eats.firebaseapp.com",  
  projectId: "zesty-eats",  
  storageBucket: "zesty-eats.appspot.com",  
  messagingSenderId: "984457752458",  
  appId: "1:984457752458:web:7c621293c11ddaa81e6273",  
  measurementId: "G-5WCLQ0527R"  
});  
  

const messaging = firebase.messaging();
