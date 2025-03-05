from app import create_app
from flask import make_response, redirect, request, jsonify, url_for
from app.models import users_collection , chats_collection
from app.utils.mail import send_reset_email
import secrets
from app.routes import user_routes
from datetime import datetime , timedelta 
from datetime import datetime, timedelta, timezone
from app.utils.security import  *
from authlib.integrations.flask_client import OAuth
import certifi
import uuid

@user_routes.route("/get-username", methods=["POST"])
def get_username():
    try:
        data = request.get_json()  # Get JSON payload from request
        if not data or "access_token" not in data:
            return jsonify({"msg": "Unauthorized: No token provided"}), 401

        access_token = data["access_token"]  # Extract access_token
        decoded_token = decode_token(access_token)  # Decode the JWT token
        email = decoded_token.get("sub")  # Extract email from token
        
        if not email:
            return jsonify({"msg": "Invalid or expired token"}), 401
        
        # Fetch user from database using the extracted email
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        return jsonify({"username": user.get("username")}), 200
    
    except Exception as e:
        return jsonify({"msg": "Error retrieving username", "error": str(e)}), 500
    

@user_routes.route("/profile", methods=["POST"])
def get_profile():
    try:
        data = request.get_json()
        if not data or "access_token" not in data:
            return jsonify({"msg": "Unauthorized: No token provided"}), 401

        access_token = data["access_token"]
        decoded_token = decode_token(access_token)
        email = decoded_token.get("sub")

        if not email:
            return jsonify({"msg": "Invalid or expired token"}), 401
        
        # Fetch user from database using the extracted email
        user = users_collection.find_one({"email": email})
        if not user:
            return jsonify({"msg": "User not found"}), 404
        
        user_data = {
            "_id": str(user["_id"]),
            "user_id": user["user_id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "username": user["username"],
            "test_results": user["test_results"],
            "chatbot_preference": user["chatbot_preference"],
            "country": user.get("country", ""),  # Use .get() with a default value
            "gender": user.get("gender", ""),
            "phone_number": user.get("phone_number", "")
        }

        return jsonify(user_data), 200
    
    except Exception as e:
        return jsonify({"msg": "Error retrieving profile", "error":str(e)}), 500
    
@user_routes.route("/update_profile", methods=["POST"])
def update_profile():
    try:
        data = request.get_json()
        if not data or "access_token" not in data:
            return jsonify({"msg": "Unauthorized: No token provided"}), 401

        access_token = data["access_token"]
        decoded_token = decode_token(access_token)
        email = decoded_token.get("sub")

        if not email:
            return jsonify({"msg": "Invalid or expired token"}), 401

         # Extract profile update fields
        update_fields = {
            "full_name": data.get("full_name"),
            "username": data.get("username"),
            "gender": data.get("gender"),
            "country": data.get("country"),
            "phone_number": data.get("phone_number")
        }

        # Remove None values
        update_fields = {k: v for k, v in update_fields.items() if v is not None}

        # Update user in database
        result = users_collection.update_one(
            {"email": email},
            {"$set": update_fields}
        )

        if result.modified_count > 0:
            # Fetch updated user data
            updated_user = users_collection.find_one({"email": email})
            
            # Prepare user data response
            user_data = {
                "full_name": updated_user.get("full_name"),
                "username": updated_user.get("username"),
                "email": updated_user.get("email"),
                "gender": updated_user.get("gender"),
                "country": updated_user.get("country"),
                "phone_number": updated_user.get("phone_number")
            }

            return jsonify({
                "msg": "Profile updated successfully", 
                "user_data": user_data
            }), 200
        else:
            return jsonify({"msg": "No changes were made"}), 200

    except Exception as e:
        return jsonify({"msg": "Error updating profile", "error": str(e)}), 500