import React, { useState } from "react";
import { UserAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  const { signIn } = UserAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true when the authentication process begins.
    try {
      await signIn(email, password);
      Navigate("/image");
    } catch (error) {
      setError("Login failed");
      setTimeout(() => {
        setError("");
      }, 3000);
      console.log(e.message);
    } finally {
      setIsLoading(false); // Set loading back to false when the process is finished.
    }
  };
  return (
    <div className="flex flex-col items-center justify-center   min-h-screen bg-slate-400">
      <div className="border max-w-5xl rounded-lg p-4 m-8 border-slate-400 bg-slate-500">
        <h2 className="text-4xl font-bold text-center py-5">Log in</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="font-semibold  text-lg">Username</label>
          <input
            type="text"
            placeholder="Enter username"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-md p-2 w-full"
          />
          <label className="font-semibold text-lg">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="rounded-md p-2 w-full"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="mt-4 rounded-lg w-full text-center bg-slate-900 text-white p-2"
            disabled={isLoading} // Disable the button when loading is true.
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>
        <div>
          <p className="font-bold text-red-600 text-lg text-center">{error}</p>
          <p className="font-bold text-black text-lg text-center py-2">
            Don't have an account? <a href="/Signup" className="text-[blue]"> Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
