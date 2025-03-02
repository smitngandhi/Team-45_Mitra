import React, { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "../components/GoogleButton";
import illustration from "../assets/Illustration.jpg.jpeg";
import { useNavigate } from "react-router-dom"; 

const Register = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      full_name: fullName,
      username: username,
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:5000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        // Registration successful, handle accordingly
        console.log(data.msg);
        //HERE
        navigate("/");
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
          <img src={illustration} alt="Register Illustration" className="w-3/4" />
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-full md:w-1/2 p-10">
          <h2 className="text-2xl font-semibold text-gray-800">Welcome to</h2>
          <h2 className="text-3xl font-bold text-[#8A7FDB]">Mitra</h2>

          {/* Full Name */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium">Full Name</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <span className="text-gray-500 pr-2">👤</span>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-transparent focus:outline-none text-gray-800" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)} 
              />
            </div>
          </div>

          {/* Username */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Username</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <span className="text-gray-500 pr-2">👤</span>
              <input 
                type="text" 
                placeholder="johndoe123" 
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={username}
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Email</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <span className="text-gray-500 pr-2">📧</span>
              <input 
                type="email" 
                placeholder="example@gmail.com" 
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-gray-700 font-medium">Password</label>
            <div className="flex items-center border rounded-lg mt-1 px-3 py-2 bg-gray-100">
              <span className="text-gray-500 pr-2">🔑</span>
              <input 
                type="password" 
                placeholder="********" 
                className="w-full bg-transparent focus:outline-none text-gray-800"
                value={password}
                onChange={(e) => setPassword(e.target.value)} 
              />
              <span className="text-gray-500 cursor-pointer">👁️</span>
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Register Button */}
          <button 
            className="w-full bg-[#8A7FDB] text-white font-semibold rounded-lg py-3 mt-4"
            onClick={handleSubmit}
          >
            Register
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-4">
            <hr className="w-full border-gray-300" />
            <span className="px-3 text-gray-400">OR</span>
            <hr className="w-full border-gray-300" />
          </div>

          {/* Google Registration Button */}
          <GoogleButton text="Register with Google" />

          {/* Login Link */}
          <p className="text-center mt-4 text-gray-600">
            Already have an account?
            <Link to="/login" className="text-[#8A7FDB] font-semibold"> Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
