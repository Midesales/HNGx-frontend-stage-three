import React from "react";
import {  Routes, Route } from "react-router-dom";
import Login from "./component/Login";
import Imagepage from "./component/image";
import ProtectedRoute from './component/ProtectedRoute';
import { AuthContextProvider } from "./context/Authcontext";

function App() {
  return (
    <div className="">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Image" element={<ProtectedRoute><Imagepage /></ProtectedRoute>} />
        </Routes>

      </AuthContextProvider>
    </div>
      
      
   
  );
}

export default App;
