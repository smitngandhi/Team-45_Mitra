import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import "./animate.css";

const Navbar = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      if (cookies.access_token) {
        try {
          const response = await fetch("http://127.0.0.1:5000/api/v1/get-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ access_token: cookies.access_token }),
          });

          const data = await response.json();
          if (response.ok) {
            setUsername(data.username);
          } else {
            setUsername(null);
          }
        } catch (error) {
          console.error("Error fetching username:", error);
          setUsername(null);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUsername();
  }, [cookies.access_token]);

  const handleLogout = () => {
    removeCookie("access_token", { path: "/" });
    setUsername(null);
    navigate("/login");
  };

  const handleMitraClick = () => {
    if (cookies.access_token) {
      navigate("/home");
    } else {
      navigate("/");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
          <div onClick={handleMitraClick} className="cursor-pointer">
            <h1 className="text-2xl font-bold text-indigo-600 animated-text">MITRA</h1>
          </div>      
          <div className="hidden md:flex items-center space-x-5 ml-auto">
            <Link to="test" className="text-gray-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">Know Your Mind</Link>
            <Link to="/Chatbot" className="text-gray-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">MindChat</Link>
            <Link to="plan" className="text-gray-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">SelfCare Plans</Link>
            <Link to="/faqs" className="text-gray-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">FAQs</Link>
            <Link to="/contactus" className="text-gray-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">Contact Us</Link>
          </div>
          <div className="flex items-center space-x-5 ml-6">
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : username ? (
              <div className="flex items-center space-x-4">
                <span className="text-indigo-600 font-semibold hidden md:block">Hello, {username}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-md text-sm transition-all duration-300 hover:bg-red-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 border rounded-md transition-all duration-300 hover:bg-gray-200"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md transition-all duration-300 hover:bg-indigo-700 hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
      <div className="h-16"></div>
    </>
  );
};

export default Navbar;