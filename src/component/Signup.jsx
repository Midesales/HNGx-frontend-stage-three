import React, { useState } from "react";
import { UserAuth } from "../context/Authcontext"; 
import {useNavigate} from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const Navigate = useNavigate()

  const { createUser} = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setTimeout(() => {
        setError(""); // Clear the error message after 3 seconds
      }, 3000); // 3000 milliseconds = 3 seconds
      return;
    }

    try {
      // Create a new user using Firebase Auth
      await createUser(email, password);
      Navigate('/image')
       setEmail("");
       setPassword("");
       setConfirmPassword("");
    } catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center   min-h-screen bg-gray-100">
      <div className="border max-w-5xl rounded-lg p-4 m-8 bg-white px-10">
        <h2 className="text-xl font-bold PX-5 py-2">SIGN UP</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="py-2">
            <label className="font-semibold text-lg pb-3">Username</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md p-2 w-full border-2 border-slate-200 outline-none"
            />
          </div>
          <div className="py-2">
            <label className="font-semibold text-lg pb-3">
              Password
            </label>
            <input
              type="password"
              className="rounded-md p-2 w-full border-2 border-slate-200 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="py-2">
            <label
              className="font-semibold text-lg pb-3"
            >
              Confirm Password
            </label>
            <input
              type="password"
              className="rounded-md p-2 w-full border-2 border-slate-200 outline-none"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="mt-4 rounded-lg w-full text-center bg-red-400  text-white p-2"
          >
            SIGN UP
          </button>
        </form>

        <p className="font-semibold lg:text-lg text-center py-2">
          Already have an account?{" "}
          <a href="/Login" className="underline">
            Log in
          </a>
        </p>

        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Signup;
