# MITRA - AI-Powered Mental Wellness Assistant

## 🧠 What is MITRA?
**MITRA** is an AI-powered mental wellness assistant designed to provide users with personalized mental health support. It offers intelligent chatbot interactions, psychological assessments, progress tracking, and secure authentication to ensure a safe and effective experience. MITRA is built with robust MLOps principles, allowing for efficient deployment, scalability, and real-world implementation.

---

## 🚀 Features
- 🤖 **AI Chatbot** – Engages in meaningful conversations based on user sentiment.
- 📝 **Psychological Assessments** – Implements PHQ-9, GAD-7, DASS-21, and IES-R tests.
- 📊 **Progress Tracking** – Monitors user mental health trends over time.
- 🔒 **Secure Authentication** – User registration, login, password recovery.
- 🧠 **Personalized Therapy Plans** – Adapts chatbot responses based on assessments.
- ☁️ **Cloud-Based Scalability** – Backend structured for seamless frontend integration.
- 📧 **Email-Based Verification** – Secure password reset functionality.
- 🏗️ **Modular Backend Architecture** – Follows clean, maintainable design.
- 🌐 **Role-Based Access Control** – Future scope for personalized user experience.

---

## 🏗️ Project Structure
```
Mitra/
│── app/
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── auth_routes.py    # Handles authentication (signup, login, reset)
│   │   ├── chatbot_routes.py # Chatbot interactions
│   │   ├── test_routes.py    # Psychological assessments API
│   ├── utils/
│   │   ├── mail.py           # Email handling
│   │   ├── security.py       # JWT & password security
│   │   ├── config.py         # Configuration management
│   │   ├── database.py       # Database connection & models
│── mitra_venv/               # Virtual environment
│── .gitignore                # Ignore unnecessary files
│── README.md                 # Project documentation
│── requirements.txt          # Dependencies
│── run.py                    # Entry point for API
│── .env                      # Environment variables
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/smitngandhi/Mitra.git
cd Mitra
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

## 🛠️ Tech Stack
- **Backend:** Flask, Flask-JWT-Extended, Flask-Mail
- **Database:** MongoDB (NoSQL)
- **Frontend:** React.js (Planned Integration)
- **Authentication:** JWT-based with bcrypt password hashing
- **ML Models:** NLP-based chatbot with sentiment analysis

---

## 🔮 Future Enhancements
- 🎭 **Multiple Chatbot Personalities** (Friend, Parent, Therapist mode)
- 📊 **Advanced Sentiment Analysis** for deeper insights
- 🎯 **Gamified Mental Health Activities**
- 🔗 **OAuth Integration** (Google, GitHub)
- 🔍 **AI-Based Therapy Recommendations**

---

## 🤝 Contributing
We welcome contributions! Please follow best practices and submit PRs with detailed explanations.

---

## 📧 Contact
For inquiries, reach out to **smitngandhi585@gmail.com** or open an issue on GitHub.

MITRA – Your AI Companion for Mental Wellness 💙

