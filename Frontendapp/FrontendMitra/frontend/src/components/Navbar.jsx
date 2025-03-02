import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-3 shadow-md">
      <h1 className="text-xl font-bold">MITRA</h1>
      <div className="flex items-center space-x-5 ml-auto">
        <a href="#" className="text-gray-600 hover:text-black">Services ▼</a>
        <a href="#" className="text-gray-600 hover:text-black">About Us</a>
        <a href="#" className="text-gray-600 hover:text-black">Contact Us</a>
      </div>
      <div className="flex items-center space-x-5 ml-6">
        <Link to="/login" className="px-4 py-2 border rounded-md">Login</Link>
        <Link to="/register" className="px-4 py-2 bg-indigo-600 text-white rounded-md">Register</Link>
      </div>
    </nav>
  );
};

export default Navbar;
