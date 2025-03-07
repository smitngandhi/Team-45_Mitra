import bcrypt
from flask_jwt_extended import create_access_token, decode_token
import re
import hashlib

import requests
from backend.models import *
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

def is_valid_username(username):
    return bool(re.match(r"[A-Za-z]\w{4,}", username))

def verify_username(username):
    return bool(users_collection.find_one({"username": username}))

def generate_hash_password(password):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def verify_password(password, hashed_password):
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

def generate_token(identity):
    return create_access_token(identity=identity)

def decode_jwt(token):
    return decode_token(token)

def is_strong_password(password):
    pattern = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
    return bool(re.match(pattern, password))

def is_valid_email(email):
    pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(re.match(pattern, email))

def generate_hash_token(token):
    return hashlib.sha256(token.encode()).hexdigest()

def generate_llm_response_sentiment(user_message, chatbot_preference, username):
    name = False  # Initialize variables before the if block
    bot = False
    analyzer = SentimentIntensityAnalyzer()
    
    if username:
        name = True
        if chatbot_preference:
            bot = True
        
    if not name or not bot:
        if "generate" in user_message.lower() or "plan" in user_message.lower():
            return "Sorry, You have to register first to generate a plan.", 0.5
    
    if name and bot:
        messages = [
            SystemMessage(content=f"You are a {chatbot_preference} chatbot and you are talking with {username}. Be empathetic and supportive."),
            HumanMessage(content=user_message)
        ]
    elif name:
        messages = [
            SystemMessage(content=f"You are a mental health chatbot and you are talking with {username}. Be empathetic and supportive."),
            HumanMessage(content=user_message)
        ]
    else:
        messages = [
            SystemMessage(content=f"You are a mental health chatbot. Be empathetic and supportive."),
            HumanMessage(content=user_message)
        ]
    
    # Sentiment Analysis
    scores = analyzer.polarity_scores(user_message)
    compound_score = scores['compound']
    sentiment_score = (compound_score + 1) / 2
    
    # If user message contains "generate" or "plan", fetch user info from DB and call PDF API
    if "generate" in user_message.lower() or "plan" in user_message.lower():
        user = users_collection.find_one({"username": username})
        if not user:
            return "User not found.", sentiment_score
        
        user_id = user.get("user_id")
        if not user_id:
            return "User ID not found.", sentiment_score
        
        # Call the self-care PDF API
        response = requests.post(
            "http://127.0.0.1:5000/api/v1/api/generate_selfcare_pdf", 
            json={"user_id": user_id}
        )
        
        if response.status_code == 200:
            return "Your self-care plan is being generated and will be emailed to you.", sentiment_score
        else:
            return "Error generating self-care plan.", sentiment_score
    
    response = llm.invoke(messages)
    return response.content, sentiment_score





