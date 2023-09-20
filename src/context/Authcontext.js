import React, { createContext,useState, useContext, useEffect } from 'react';
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '../firebase';

const UserContext = createContext();


export const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState({})

 

  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  };

  const logout = () => {
    return signOut(auth)
  }

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser)
  })
    
  return () => {
    unsubscribe()
  }
}, [])


  return (
    <UserContext.Provider value={{user, logout, signIn}}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
