import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDqTj3vbrFKUdTP54yQwmjYi2f15GNAdA",
  authDomain: "bijli-51de5.firebaseapp.com",
  databaseURL: "https://bijli-51de5.firebaseio.com",
  projectId: "bijli-51de5",
  storageBucket: "bijli-51de5.firebasestorage.app",
  messagingSenderId: "915885296575",
  appId: "1:915885296575:web:b9542ealf5a758fdebafoa",
  measurementId: "G-FQEW9HNX9Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
