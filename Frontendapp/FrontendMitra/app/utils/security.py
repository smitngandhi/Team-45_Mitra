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
    return bool(re.match(r"^[A-Za-z][A-Za-z0-9_]{4,}$", username))

def verify_username(username):
    existing_user = users_collection.find_one({"username": username})
    return existing_user

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

def generate_llm_response_sentiment(user_message):
    analyzer = SentimentIntensityAnalyzer()
    messages = [
        SystemMessage(content="You are a mental health support chatbot. Be empathetic and supportive."),
        HumanMessage(content=user_message)
    ]
    scores = analyzer.polarity_scores(user_message)
    compound_score = scores['compound']
    sentiment_score = (compound_score + 1) / 2 


    response = llm(messages)
    return response.content , sentiment_score