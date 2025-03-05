import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Chatbot from "./pages/Chatbot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FAQS from "./pages/FAQs";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import After_Login_Home from "./pages/After_Login_Home";
import Profile from "./pages/Profile"
import Test from "./pages/Test"


const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<After_Login_Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Chatbot" element={<Chatbot />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/faqs" element={<FAQS />}/>
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/reset_password/:token" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<Test/>}/>
      </Routes>
      {/* <Footer /> */}
    </>
  );
};

export default App;