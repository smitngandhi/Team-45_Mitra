# Team-45_Mitra

## Overview
**Mitra** is an AI-powered mental wellness assistant that provides users with emotional support and personalized self-care plans based on sentiment analysis of chat interactions. The backend is built using **Flask**, incorporating **MongoDB** for user and chat storage, **VADER Sentiment Analysis** for mood tracking, and **FPDF** for generating self-care reports.

## Features
- **User Authentication** (Registration, Login, Google Authentication, Password Recovery)
- **Chatbot API** (LLM-based mental health chatbot with sentiment-aware responses)
- **Sentiment Analysis** (Tracks user emotions and adjusts chatbot behavior accordingly)
- **Self-Care Plan Generation** (Creates PDF reports based on sentiment trends)
- **Secure API Endpoints** (JWT authentication, request validation, and security best practices)

## Project Structure
```
Team-45_Mitra/
│── app/
│   │── routes/
│   │   │── auth_routes.py        # Handles user authentication (login, register, password reset)
│   │   │── chatbot_routes.py     # Chatbot API for generating responses and sentiment analysis
│   │   │── test_routes.py        # Routes for testing purposes
│   │   │── user_routes.py        # Handles user-related actions like profile retrieval
│   │── utils/
│   │   │── mail.py               # Email handling for password recovery & self-care plan delivery
│   │   │── security.py           # Security utilities (password hashing, JWT verification)
│   │   │── config.py             # Configuration settings (DB connections, API keys, etc.)
│   │   │── models.py             # Defines database models for users and chats
│   └── __init__.py                # Initializes Flask application
│── README.md                     # Project documentation
```

## Installation & Setup
### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/Team-45_Mitra.git
cd Team-45_Mitra
```
### 2. Create a Virtual Environment & Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
```
### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following:
```
MONGO_URL="YOUR_MONGO_URL"
JWT_SECRET_KEY="supersecretkey31"
MAIL_SERVER="smtp.gmail.com"
MAIL_PORT=587
MAIL_USE_TLS="True"
MAIL_USERNAME="YOUR_BUISNESS_GMAIL"
MAIL_PASSWORD="AUTHENTICATION PASSWORD"
MONGO_DB_NAME="mydatabase"
CLIENT_ID='YOUR_CLIENT_ID'
CLIENT_SECRET='YOUR_CLIENT_ID'
TOGETHER_API_KEY="YOUR_TOGETHER_API_KEY"
```

### 4. Run the Flask Application
```bash
python run.py
```
The server will start at `http://127.0.0.1:5000`

## API Endpoints
### Authentication Routes
| Method | Endpoint            | Description |
|--------|---------------------|-------------|
| POST   | `/api/v1/register`     | User registration |
| POST   | `/api/v1/login`        | User login |
| POST   | `/api/v1/forgot-password` | Sends password reset email |
| POST   | `/api/v1/reset-password/<token>` | Resets user password |
| GET   | `/api/v1/login/google` | Authorization by google |


### Chatbot Routes
| Method | Endpoint                | Description |
|--------|-------------------------|-------------|
| POST   | `/api/v1/api/chat`             | Generates chatbot response & sentiment analysis |
| POST   | `/api/v1/api/generate_selfcare_pdf` | Generates and emails self-care plan PDF |

### User Routes
| Method | Endpoint       | Description |
|--------|---------------|-------------|
| GET    | `/api/v1/get-username` | Fetches user username |
| POST   | `/api/user/update-profile` | Updates user profile |
| GET    | `/api/v1/profile` | Fetches user details |

## Key Components
- **`init.py`**: Initializes Flask, JWT, Mail, OAuth, and database connections.
- **`config.py`**: Manages app configurations via environment variables.
- **`models.py`**: Defines MongoDB collections (`users`, `chats`).


