import * as firebase from 'firebase';
import 'firebase/firestore';

export const firebaseConfig = {
//    apiKey: "AIzaSyDqHj6cAno1pzb2_MqJPo3Fc5Djvzqjtak",
//     authDomain: "tiecon-portal.firebaseapp.com",
//     databaseURL: "https://tiecon-portal.firebaseio.com",
//     projectId: "tiecon-portal",
//     storageBucket: "",
//     messagingSenderId: "835953773150"

apiKey: "AIzaSyCzVXiljFFXW1p6-uvXAAXvfWVa0LTuC2g",
authDomain: "tiecon-a9958.firebaseapp.com",
databaseURL: "https://tiecon-a9958.firebaseio.com",
projectId: "tiecon-a9958",
storageBucket: "tiecon-a9958.appspot.com",
messagingSenderId: "452511959689"
} // from Firebase Console

firebase.initializeApp(firebaseConfig)
export const firestoredb = firebase.firestore();
export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth