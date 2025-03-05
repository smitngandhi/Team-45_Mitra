# MITRA - Backend (Authentication)



## 📌 Features
- ✅ **User Authentication** (Signup, Login, Logout)
- 🔒 **Secure Password Hashing** (Using bcrypt)
- 📧 **Email-based Verification & Password Reset**
- 🛡️ **JWT-based Authentication**
- 💜 **Environment-based Configuration**
- 🏗️ **Well-Structured Modular Codebase**
- 📂 **Virtual Environment Setup for Dependency Management**

---

## 🏡 Project Structure
```
Mitra/
│── app/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py    # Handles authentication (login, signup, reset)
│   │   ├── user_routes.py    # User-related operations
│   ├── utils/
│   │   ├── mail.py           # Handles email sending
│   │   ├── security.py       # Security utilities (password hashing, JWT)
│   │   ├── config.py         # Environment & configuration management
│   │   ├── models.py         # Database models
│── mitra_venv/               # Virtual environment
│── .gitignore                # Git ignored files (venv, env files, etc.)
│── README.md                 # Project documentation
│── requirements.txt          # Dependencies list
│── run.py                    # Entry point for the application
│── .env                      # Environment variables (DB credentials, secrets)
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/mitra-auth.git
cd mitra-auth
```

### 2️⃣ Create a Virtual Environment
```sh
python -m venv mitra_venv
source mitra_venv/bin/activate  # For Linux/macOS
mitra_venv\Scripts\activate     # For Windows
```

### 3️⃣ Install Dependencies
```sh
pip install -r requirements.txt
```

### 4️⃣ Configure Environment Variables
Rename `.env.example` to `.env` and update necessary values:
```env
SECRET_KEY=your_secret_key
DATABASE_URL=your_database_url
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_password
```

### 5️⃣ Run the Application
```sh
python run.py
```

---

## 🛠️ Built With
- **Flask** - Web framework
- **Flask-JWT-Extended** - Secure token-based authentication
- **bcrypt** - Password hashing
- **Flask-Mail** - Email service for verification & password recovery

---

## 🚀 Future Enhancements
- 🔹 Role-based Access Control (RBAC)
- 🔹 OAuth Integration (Google, GitHub)
- 🔹 Logging & Monitoring

---


