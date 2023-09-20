import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
    apiKey : 'AIzaSyC84u5B6W9c57WgVKuOgKWFVGbnmv1lrKA',
    authDomain:  'auth-app-d7135.firebaseapp.com',
  projectId: 'auth-app-d7135',
  storageBucket: 'auth-app-d7135.appspot.com',
  messagingSenderId: '131432314274',
  appId: '1:131432314274:web:f07dd372815515a0f4eefb',
}

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export default app