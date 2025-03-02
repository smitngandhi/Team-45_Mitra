import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import illustration from "../assets/Illustration.jpg.jpeg";
import { useNavigate } from "react-router-dom"; 

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        // Handle successful login (e.g., redirect to dashboard)
        navigate("/");
        console.log(data.msg);
      } else {
        setError(data.msg); // Handle error response from Flask
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full flex">
        
        {/* Left Section - Illustration */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white">
          <img src={illustration} alt="Login Illustration" className="w-3/4" />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-10">
        <h2 className="text-3xl font-medium text-gray-600">
            Welcome Back, <span className="text-4xl font-bold text-[#8A7FDB]">Mitra</span>
          </h2>
          <h2 className="text-lg font-bold text-[#8A7FDB]">Let's dive in.</h2>

          {/* Email Input */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium">Email</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <input 
                type="email" 
                placeholder="Enter valid email here" 
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100 relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="absolute right-3 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-[#5C49E0] font-semibold">Forgot Password?</Link>
          </div>

          {/* Login Button */}
          <button 
          className="w-full bg-[#8A7FDB] text-white font-semibold rounded-lg py-3 mt-4
                    transition-all duration-300 hover:bg-[#6f63cc] hover:shadow-md"
          onClick={handleSubmit}
        >
          Login
        </button>

          {/* Error Message */}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="px-3 text-gray-400">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Google Login Button */}
          <GoogleButton text="Sign in with Google" />

          {/* Register Link */}
          <p className="text-center mt-4 text-gray-600">
            Don't have an account?
            <Link to="/register" className="text-[#8A7FDB] font-semibold"> Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
