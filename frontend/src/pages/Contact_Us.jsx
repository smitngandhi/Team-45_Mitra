import React from "react";
import "../Contact_Us.css";

const teamMembers = [
  {
    name: "DHRUVIL JOSHI",
    role: "Architect",
    description: "The strategic backbone of MITRA. Dhruvil ensures that the system is well-structured, scalable, and robust. His expertise in backend engineering and architecture makes the AI-driven mental wellness assistant a reality.",
    email: "dhruviljoshi1910@gmail.com",
  },
  {
    name: "SMIT GANDHI",
    role: "Protagonist",
    description: "A visionary thinker, Smit drives innovation and ensures MITRA stays ahead in AI-driven wellness solutions. His expertise in deep learning and research keeps the project cutting-edge.",
    email: "smitgandhi585@gmail.com",
  },
  {
    name: "PRACHI DESAI",
    role: "Protagonist",
    description: "With a keen eye for UI/UX, Prachi crafts seamless user experiences. Her contributions in chatbot fine-tuning and sentiment analysis ensure MITRA understands and connects with users effectively.",
    email: "prachidesai7708@gmail.com",
  },
  {
    name: "MANAN MODI",
    role: "Commander",
    description: "A decisive leader in frontend and cloud solutions, Manan ensures MITRA is accessible, responsive, and scalable. His ability to translate ideas into intuitive interfaces makes the project user-friendly.",
    email: "manan.modi9618@gmail.com",
  },
];

const ContactUs = () => {
  return (
    <div className="contact-container">
      <h1 className="contact-title">Meet Our Team</h1>
      <div className="team-flex">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            <div className="card-inner">
              {/* Front Side - Only Name */}
              <div className="card-front">
                <h2>{member.name}</h2>
              </div>
              {/* Back Side - Full Details */}
              <div className="card-back">
                <h2>{member.name}</h2>
                <h3>{member.role}</h3>
                <p>{member.description}</p>
                <a href={`mailto:${member.email}`} className="contact-email">
                  {member.email}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactUs;
