from app import create_app
from flask import make_response, redirect, request, jsonify, url_for
from app.models import users_collection , chats_collection
from app.utils.mail import send_reset_email
import secrets
from app.routes import chatbot_routes
from datetime import datetime , timedelta 
from datetime import datetime, timedelta, timezone
from app.utils.security import  *
from authlib.integrations.flask_client import OAuth
import certifi
import uuid


@chatbot_routes.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()
    message = data["message"]
    print(message)

    if "access_token" in data and data["access_token"]:
        access_token = data["access_token"]
        decoded_token = decode_token(access_token)
        email = decoded_token.get("sub")
        user = users_collection.find_one({"email": email})

        chatbot_preference = user["chatbot_preference"]
        username = user["full_name"]
        print(username)
        response_text  , sentiment_score = generate_llm_response_sentiment(message , chatbot_preference , username)
        print(response_text)
        chat_entry = {
        "user_id": user["user_id"],
        "user_message": message,
        "bot_response": response_text,
        "timestamp": datetime.now(timezone.utc),
        "sentiment_score" : sentiment_score
        }
        chats_collection.insert_one(chat_entry)

        return jsonify({"reply": response_text , "sentiment_score": sentiment_score} )


    response_text  , sentiment_score = generate_llm_response_sentiment(message , None , None)
    # user_id = request.cookies.get("user_id")  # Fetch user_id from cookies

    # if not user_id:
    #     print("Did not find the user_id")
    #     return jsonify({"error": "Unauthorized"}), 401


    user_id = str(uuid.uuid4())
    chat_entry = {
        "user_id": user_id,
        "user_message": message,
        "bot_response": response_text,
        "timestamp": datetime.now(timezone.utc),
        "sentiment_score" : sentiment_score
    }

    chats_collection.insert_one(chat_entry)

    return jsonify({"reply": response_text , "sentiment_score": sentiment_score} )


