import React, { useState, useEffect } from 'react';
import '../Profile.css';
import axios from 'axios';
import user_profile from "../assets/user_profile.png"

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    username: '',
    email: '',
    gender: '',
    country: '',
    phone_number: ''
  });
  const [currentDate, setCurrentDate] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'short',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
    setCurrentDate(formattedDate);
    const accessToken = getCookie('access_token');
    if (accessToken) {
      fetchProfileData(accessToken);
    }
  }, []);

  // Function to get cookie by name
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Fetch profile data from backend
  const fetchProfileData = async (accessToken) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/v1/profile', {
        access_token: accessToken
      });

      const userData = response.data;
      setProfileData({
        full_name: userData.full_name,
        username: userData.username,
        email: userData.email,
        gender: userData.gender || '', // Default if not set
        country: userData.country || '', // Default if not set
        phone_number: userData.phone_number || '' // Default if not set
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setError('Failed to fetch profile data');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError(null); // Clear any previous errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Function to save profile changes
  const saveProfileChanges = async () => {
    try {
      const accessToken = getCookie('access_token');
      
      // Prepare the data to be sent
      const updateData = {
        access_token: accessToken,
        full_name: profileData.full_name,
        username: profileData.username,
        gender: profileData.gender,
        country: profileData.country,
        phone_number: profileData.phone_number
      };

      // Make API call to update profile
      const response = await axios.post('http://127.0.0.1:5000/api/v1/update_profile', updateData);

      // If update is successful
      if (response.status === 200) {
        // Update local state with returned user data
        if (response.data.user_data) {
          setProfileData(response.data.user_data);
        }
        
        // Show success message
        console.log(response.data.msg);
        
        // Toggle editing off
        setIsEditing(false);
        setError(null);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      
      // Handle error 
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(error.response.data.msg || 'Failed to update profile');
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error updating profile');
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">MITRA</div>
        <nav className="nav-menu">
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <span>MINDchat</span>
          </div>
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </div>
            <span>HealthCare</span>
          </div>
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <span>Welfare Test</span>
          </div>
          <div className="nav-item active">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <span>Profile</span>
          </div>
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
            </div>
            <span>Health Reports</span>
          </div>
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
            <span>Home</span>
          </div>
          <div className="nav-item">
            <div className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span>Logout</span>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-content">
        <div className="header">
          <h1>Welcome, {profileData.username}</h1>
          <p className="date">{currentDate}</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-banner" style={{
            backgroundColor: '#ffdddd',
            color: '#ff0000',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px'
          }}>
            {error}
          </div>
        )}

        <div className="profile-banner">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              <img src={user_profile} alt="Profile" />
            </div>
          </div>
          <div className="profile-details">
            <h2 className="user-name">{profileData.full_name}</h2>
            <button 
              className="edit-btn" 
              onClick={isEditing ? saveProfileChanges : handleEditToggle}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label className="Text">Full Name</label>
              <input 
                type="text" 
                name="full_name"
                value={profileData.full_name} 
                onChange={isEditing ? handleInputChange : undefined}
                disabled={!isEditing} 
                className="form-control" 
              />
            </div>
            <div className="form-group">
              <div className="label-with-tag">
                <label className="Text">Phone Number</label>
                {!isEditing && !profileData.phone_number}
              </div>
              {isEditing ? (
                <input 
                  type="text" 
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleInputChange}
                  placeholder="Enter Phone Number" 
                  className="form-control" 
                />
              ) : (
                <input 
                  type="text" 
                  value={profileData.phone_number || ''} 
                  disabled 
                  className="form-control" 
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="Text">Gender</label>
              {isEditing ? (
                <div className="select-wrapper">
                  <select 
                    name="gender"
                    className="form-control"
                    value={profileData.gender}
                    onChange={handleInputChange}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              ) : (
                <input 
                  type="text" 
                  value={profileData.gender} 
                  disabled 
                  className="form-control" 
                />
              )}
            </div>
            <div className="form-group">
              <div className="label-with-tag">
                <label className="Text">Country</label>
                {!isEditing && profileData.country === 'India'}
              </div>
              {isEditing ? (
                <div className="select-wrapper">
                  <select 
                    name="country"
                    className="form-control"
                    value={profileData.country}
                    onChange={handleInputChange}
                  >
                    <option>India</option>
                    <option>USA</option>
                    <option>UK</option>
                  </select>
                </div>
              ) : (
                <input 
                  type="text" 
                  value={profileData.country} 
                  disabled 
                  className="form-control" 
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="Text">Language</label>
              <input 
                type="text" 
                value="English" 
                disabled 
                className="form-control" 
              />
            </div>
          </div>

          <div className="email-section">
            <label className="My-Email">My email Address</label>
            <div className="email-container">
              <div className="email-box">
                <div className="email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div className="email-info">
                  <div className="email">{profileData.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;