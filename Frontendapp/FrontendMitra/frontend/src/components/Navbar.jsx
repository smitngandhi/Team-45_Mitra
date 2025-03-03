import { Link } from "react-router-dom";
import "./animate.css";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-3 shadow-md bg-white">
    <Link to="/">
    <h1 className="text-2xl font-bold animated-text">MITRA</h1>
  </Link>      
    <div className="flex items-center space-x-5 ml-auto">
      <Link to="test" className="text-black-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">Know Your Mind</Link>
        <Link to="chat" className="text-black-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">MindChat</Link>
        <Link to="plan" className="text-black-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">SelfCare Plans</Link>
        <Link to="/faqs" className="text-black-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">FAQs</Link>
        <Link to="/contactus" className="text-black-600 hover:text-indigo-600 hover:font-semibold transition-colors duration-500">Contact Us</Link>
        </div>
      <div className="flex items-center space-x-5 ml-6">
        {/* Login Button */}
        <Link 
          to="/login" 
          className="px-4 py-2 border rounded-md transition-all duration-300 hover:bg-gray-200"
        >
          Login
        </Link>

        {/* Register Button */}
        <Link 
          to="/register" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md transition-all duration-300
                     hover:bg-indigo-700 hover:shadow-md"
        >
          Register
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
