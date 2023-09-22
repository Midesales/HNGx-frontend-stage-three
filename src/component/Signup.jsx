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
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#ddd]">
      <div className="border max-w-5xl rounded-lg p-4 m-8 bg-[#7d7d88]">
        <h2 className="text-4xl font-bold text-center py-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="font-semibold text-lg">Username</label>
          <input
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md p-2 w-full"
          />
          <label htmlFor="password" className="font-semibold text-lg">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            className="rounded-md p-2 w-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword" className="font-semibold text-lg">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            className="rounded-md p-2 w-full"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="mt-4 rounded-lg w-full text-center bg-[blue] text-white p-2"
          >
            Sign up
          </button>
        </form>

        <p className="text-center font-bold py-2 text-sm lg:text-lg">
          Already have an account?{" "}
          <a href="/Login" className="text-[blue]">
            Log in
          </a>
        </p>

        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

export default Signup;
