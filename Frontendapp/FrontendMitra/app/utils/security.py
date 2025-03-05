# import bcrypt
# from flask_jwt_extended import create_access_token, decode_token
# import re
# import hashlib
# # Hash Password
# def generate_hash_password(password):
#     return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

# # Verify Password
# def verify_password(password, hashed_password):
#     return bcrypt.checkpw(password.encode("utf-8"), hashed_password)

# # Generate JWT Token
# def generate_token(identity):
#     return create_access_token(identity=identity)

# # Decode JWT Token
# def decode_jwt(token):
#     return decode_token(token)


# def is_strong_password(password):
#     pattern = r"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
#     return bool(re.match(pattern, password))

# def is_valid_email(email):
#     pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
#     return bool(re.match(pattern, email))


# def generate_hash_token(token):
#     return hashlib.sha256(token.encode()).hexdigest()

import bcrypt
from flask_jwt_extended import create_access_token, decode_token
import re
import hashlib
from app.models import *
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

def generate_llm_response_sentiment(user_message , chatbot_preference , username):


    name = False  # Initialize variables before the if block
    bot = False

    
    analyzer = SentimentIntensityAnalyzer()

    if username:
        name=True
        if chatbot_preference:
            bot=True
    
    if name and bot:
        messages = [
        SystemMessage(content=f"You are a {chatbot_preference} chatbot and you are talking with {username}. Be empathetic and supportive."),
        HumanMessage(content=user_message)
    ]
    
    if name:
        messages = [
        SystemMessage(content=f"You are a mental health chatbot and you are talking with {username}. Be empathetic and supportive."),
        HumanMessage(content=user_message)
    ]
    
    else:
        messages = [
        SystemMessage(content=f"You are a mental health chatbot. Be empathetic and supportive."),
        HumanMessage(content=user_message)
    ]
        
    scores = analyzer.polarity_scores(user_message)
    compound_score = scores['compound']
    sentiment_score = (compound_score + 1) / 2 


    response = llm.invoke(messages)
    return response.content , sentiment_score   