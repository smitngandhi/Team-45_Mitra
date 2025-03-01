# User Authentication with Flask & MongoDB

## 📌 Features
- ✅ **User Authentication** (Signup, Login, Logout)
- 🔒 **Secure Password Hashing** (Using Werkzeug Security)
- 📣 **Google OAuth Authentication** (Login via Google)
- 🛡️ **Session-based Authentication**
- 💜 **MongoDB as Database Backend**
- 🛠️ **Modular & Scalable Codebase**

---

## 🏡 Project Structure
```
USER-AUTHENTICATION-WITH-FLASK-MAIN-MONGO-DB/
│── user_authentication/             # Main Application Package
│   ├── __pycache__/                 # Compiled Python files
│   ├── instance/                    # Flask instance folder
│   ├── static/                      # CSS, JS, and Images
│   ├── templates/                   # HTML Templates (Frontend Pages)
│── api_key.py                        # API Key Management
│── with_database.py             # Login file with MySql Database
│── with_mongodb.py                   # Main Application Entry Point with Mongo Database
│── README.md                         # Project Documentation
│── requirements.txt                   # Dependencies List
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone -b Dhruvil https://github.com/smitngandhi/Mitra.git
cd user-authentication-with-flask-mongo-db
```

### 2️⃣ Create a Virtual Environment
```sh
python -m venv venv
source venv/bin/activate  # For Linux/macOS
venv\Scripts\activate     # For Windows
```

### 3️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 4️⃣ Configure Environment Variables
Rename `.env.example` to `.env` and update the required values:
```env
SECRET_KEY=your_secret_key
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/your_database
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 5️⃣ Run the Application
```sh
python with_mongodb.py
```

---

## 🛠️ Built With
- **Flask** - Python Web Framework
- **MongoDB** - NoSQL Database
- **Flask-PyMongo** - MongoDB Integration for Flask
- **Authlib** - OAuth Authentication
- **Werkzeug Security** - Secure Password Hashing

---

## 🚀 Migration Process (MySQL ➔ MongoDB)
- Initially developed with **MySQL** using Flask-SQLAlchemy.
- Migrated to **MongoDB** using Flask-PyMongo for better scalability.
- Modified authentication system to store hashed passwords in MongoDB.
- Implemented Google OAuth authentication using Authlib.

---

## 🚀 Future Enhancements
- 🔹 Role-based Access Control (RBAC)
- 🔹 Multi-Factor Authentication (MFA)
- 🔹 Token-based Authentication (JWT)
- 🔹 API Endpoints for Mobile Integration

---

