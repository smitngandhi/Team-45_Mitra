import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import GoogleButton from "../components/GoogleButton";
import illustration from "../assets/Illustration.jpg.jpeg";

const Login = () => {
  const navigate = useNavigate();
  const [email_or_username, setEmail_or_username] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [, setCookie] = useCookies(["access_token"]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email_or_username : email_or_username,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Important for cookie handling
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (response.ok) {
        // Set access token in cookies
        setCookie("access_token", data.access_token, { 
          path: "/", 
          maxAge: 3600 // 1 hour expiration
        });

        // Fetch username after successful login
        try {
          const usernameResponse = await fetch("http://127.0.0.1:5000/api/v1/get-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: data.access_token }),
          });

          const usernameData = await usernameResponse.json();
          if (usernameResponse.ok) {
            console.log("Username:", usernameData.username);
          }
        } catch (usernameError) {
          console.error("Error fetching username:", usernameError);
        }

        // Navigate to home page
        navigate("/home");
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
          <img 
            src={illustration} 
            alt="Login Illustration" 
            className="w-3/4 transition-transform duration-500 hover:scale-105"
          />
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
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100 
                            transition-all duration-300 focus-within:border-[#8A7FDB] focus-within:shadow-md">
              <input 
                type="text" 
                placeholder="Enter valid email/username here" 
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={email_or_username}
                onChange={(e) => setEmail_or_username(e.target.value)} 
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100 relative
                            transition-all duration-300 focus-within:border-[#8A7FDB] focus-within:shadow-md">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span 
                className="absolute right-3 cursor-pointer text-gray-500 
                           transition-transform duration-300 hover:scale-110" 
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mt-4">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="mr-2 transform scale-125 transition-transform duration-300 hover:scale-150"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <Link 
              to="/forgot_password" 
              className="text-sm text-[#5C49E0] font-semibold 
                         transition-colors duration-300 hover:text-[#8A7FDB]"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button 
            className="w-full bg-[#8A7FDB] text-white font-semibold rounded-lg py-3 mt-4
                      transition-all duration-300 hover:bg-[#6f63cc] hover:shadow-md
                      active:scale-95"
            onClick={handleSubmit}
          >
            Login
          </button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-center mt-2 
                          animate-bounce">
              {error}
            </p>
          )}

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
            <Link 
              to="/register" 
              className="text-[#8A7FDB] font-semibold 
                         transition-colors duration-300 hover:text-[#6f63cc] ml-1"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;