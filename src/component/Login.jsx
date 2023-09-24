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
    <div className="flex flex-col items-center justify-center   min-h-screen bg-gray-100">
      <div className="border max-w-5xl rounded-lg p-4 m-8 bg-white px-10">
        <h2 className="text-xl font-bold PX-5 py-2">LOGIN</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div className="py-2">
            <label className="font-semibold  text-lg pb-3">Username</label>
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-md p-2 w-full border-2 border-slate-200 outline-none"
            />
          </div>
          <div className="py-2">
            <label className="font-semibold text-lg pb-3">Password</label>
            <input
              type="password"
              className= "p-2 w-full border-2 border-slate-200 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="mt-4 rounded-lg w-full text-center bg-red-400  text-white p-2"
            disabled={isLoading} // Disable the button when loading is true.
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
        <div>
          <p className="font-bold text-red-600 text-lg text-center">{error}</p>
          <p className="font-semibold lg:text-lg text-center py-2">
            Don't have an account?{" "}
            <a href="/Signup" className="underline">
              {" "}
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
