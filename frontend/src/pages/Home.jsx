import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/image1.jpg";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
    <Navbar/>
    <div className="font-sans bg-white">
      
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between p-5 md:p-8 h-screen">
        <div className="md:w-1/2 space-y-3">
          <h2 className="text-3xl md:text-4xl font-bold leading-tight">
            Guiding You from Struggles to Strength, One Conversation at a Time
          </h2>
          <p className="text-gray-500">
            Mitra: A Gentle Whisper in the Storm, A Light in Your Darkest Hour
          </p>
          <button 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md transition-all duration-300
                    hover:bg-indigo-700 hover:shadow-md"
          onClick={() => navigate("/register")}
        >
          Get Started
        </button>
        </div>
        <div className="md:w-1/2">
          <img src={heroImage} alt="Hero" className="w-full h-auto object-cover" />
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
