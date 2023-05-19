import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging/sw";

const firebaseConfig = {
    apiKey: "AIzaSyBtPt0iUQNxfjBG8UHzHAS_iPMA68Y7dCM",
    authDomain: "kenchukky-41be3.firebaseapp.com",
    projectId: "kenchukky-41be3",
    storageBucket: "kenchukky-41be3.appspot.com",
    messagingSenderId: "544371851050",
    appId: "1:544371851050:web:c839768e703a4c8a636853",
    measurementId: "G-TZR4MRHZWV"
  };

  const messaging = getMessaging(initializeApp(firebaseConfig));
