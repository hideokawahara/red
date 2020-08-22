import firebase from "firebase"

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBAES32SyEA0cCWOTAInvr-jzmH8iS_kHw",
  authDomain: "red-react.firebaseapp.com",
  databaseURL: "https://red-react.firebaseio.com",
  projectId: "red-react",
  storageBucket: "red-react.appspot.com",
  messagingSenderId: "360215062076",
  appId: "1:360215062076:web:24768a39024b5960e50539",
  measurementId: "G-4C55435CNL",
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export default { db, auth, storage };
// export default db;