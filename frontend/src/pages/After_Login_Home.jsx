import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/image1.jpg";
import { useNavigate } from "react-router-dom";
import User from '../assets/User.png'
import image1 from '../assets/image1.jpg'
import bing from '../assets/bing.svg'
import React, { useState } from 'react';
import '../After_Login.css';
import { useCookies } from "react-cookie";
import { useEffect } from "react";


const After_Login_Home = () => {

        const [cookies, setCookie] = useCookies(["access_token"]);

        useEffect(() => {
          const urlParams = new URLSearchParams(window.location.search);
          const accessTokenFromURL = urlParams.get("access_token");

          if (accessTokenFromURL && !cookies.access_token) {
              console.log("Inside")
              setCookie("access_token", accessTokenFromURL, {
                  path: "/",
                  maxAge : 3600
              });

              console.log("Access token stored in cookies!");

              // Remove the access_token from the URL
              const newURL = window.location.pathname;
              window.history.replaceState({}, document.title, newURL);
          }
        }, [cookies.access_token, setCookie]);

        // 6 Testimonials
        const testimonialsData = [
          {
            text: "Thank you for your service. I am very pleased with the result. I have seen exponential growth in my business, and it's all thanks to your amazing service.",
            name: "Emily Stones",
            position: "CEO, Marketing Guru",
            image: User
          },
          {
            text: "Amazing experience! The best service I have ever used. It completely changed my business strategy.",
            name: "John Doe",
            position: "Founder, Tech Hub",
            image: User
          },
          {
            text: "Their service is outstanding! I highly recommend it to anyone looking for real business growth.",
            name: "Sarah Lee",
            position: "CMO, Creative Studio",
            image: User
          },
          {
            text: "I've never been happier with a partnership. Truly transformative for our workflow and results!",
            name: "Ava Smith",
            position: "Operations Lead",
            image: User
          },
          {
            text: "We achieved record sales in just a few months. The team is fantastic, always ready to help!",
            name: "Michael Green",
            position: "Head of Sales, FinCorp",
            image: User
          },
          {
            text: "Our collaboration felt seamless, and the results speak for themselves. Highly recommended!",
            name: "Rachel Brown",
            position: "Project Manager, Innovations Inc.",
            image: User
          }
        ];
      
        // Track which set of 3 testimonials is visible (0 or 3)
        const [testimonialIndex, setTestimonialIndex] = useState(0);
      
        const showNextTestimonials = () => {
          // Move from 0 to 3, or from 3 back to 0
          setTestimonialIndex((prev) => (prev + 3) % 6);
        };
      
        const showPrevTestimonials = () => {
          // Move from 0 to 3, or from 3 back to 0
          setTestimonialIndex((prev) => (prev - 3 + 6) % 6);
        };
      
        // Only show 3 testimonials based on the current index
        const visibleTestimonials = testimonialsData.slice(testimonialIndex, testimonialIndex + 3);
      
  const navigate = useNavigate();
  return (
    <>
    <Navbar/>
    <div className="app">
      {/* Main Content */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-text">
            <h2>Guiding You from Struggles to Strength, One Conversation at a Time</h2>
            <p>Mitra: A Gentle Whisper in the Storm, A Light in Your Darkest Hour</p>
            <button 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md transition-all duration-300
                    hover:bg-indigo-700 hover:shadow-md"
          onClick={() => navigate("/chatbot")}
        >Get Started</button>
          </div>
          <div className="hero-image">
            <img
              src= {image1}
              alt="Therapy session illustration"
            />
          </div>
        </div>


        {/* Services Section */}
        <div className="services-section" id="services">
          <div className="services-header">
            <h3>WHAT WE DO</h3>
            <h2>We provide you a variety of services</h2>
          </div>

          <div className="services-cards">
            <div className="service-card">
              <div className="service-icon">
                <img
                  src={bing}
                  alt="Mind icon"
                />
              </div>
              <h3>Know Your MIND</h3>
              <p>The 'Know Your Mind' test explores your psychological profile.</p>
              <button className="learn-more-btn">Learn More →</button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img
                  src={bing}
                  alt="Self-care icon"
                />
              </div>
              <h3>SELFCARE</h3>
              <p>A structured self-care plan fosters balance through healthy habits, mindfulness, and growth.</p>
              <button className="learn-more-btn">Learn More →</button>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <img
                  src={bing}
                  alt="Chat icon"
                />
              </div>
              <h3>MINDchat</h3>
              <p>MindChat: Your Intelligent Companion for Mental Well-being & Self-Care.</p>
              <button className="learn-more-btn">Learn More →</button>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-header">
            <div className="title-group">
                <h3>TESTIMONIALS</h3>
                <h2>See What Our Customers Say About Us</h2>
            </div>
            <div className="testimonial-arrows">
              <button onClick={showPrevTestimonials} className="arrow-btn">‹</button>
              <button onClick={showNextTestimonials} className="arrow-btn">›</button>
            </div>
        </div>
          
        <div className="testimonials-container">
          {visibleTestimonials.map((testimonial, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
                <img
                src={testimonial.image}
                alt={testimonial.name}
                className="author-image"
                />
              <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.position}</p>
              </div>
            </div>
          </div>
        ))}
        </div>

      </main>
    </div>
    </>
  );
};

export default After_Login_Home;
