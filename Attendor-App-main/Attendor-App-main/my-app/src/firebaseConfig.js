import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import { getFirestore } from 'firebase/firestore'



const firebase_config =     {
                            apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
                            authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
                            projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
                            storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
                            messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
                            appId: process.env.REACT_APP_FIREBASE_APP_ID
                            };

console.log(firebase_config);                       
const app = firebase.initializeApp(firebase_config);

export const db = getFirestore()
export const auth =app.auth()
export const storage = firebase.storage()
export default app



