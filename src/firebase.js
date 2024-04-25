// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "instagramapp-a7187.firebaseapp.com",
  projectId: "instagramapp-a7187",
  storageBucket: "instagramapp-a7187.appspot.com",
  messagingSenderId: "126371730697",
  appId: "1:126371730697:web:76a822a976ddb2b754efd8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

/*
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.resource.size < 2 * 1024 * 1024 &&
      request.resource.contentType.matches('image/.*')
    }
  }
}
*/