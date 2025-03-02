from app import create_app
from flask import redirect,make_response, request, jsonify, url_for
from flask_jwt_extended import create_access_token
import bcrypt
from app.config import Config
from app.models import users_collection
from app.utils.mail import send_reset_email
import secrets
from app.routes import auth_routes
from datetime import datetime , timedelta , time
from datetime import datetime, timedelta, timezone
from app.utils.security import  *
from flask_jwt_extended import jwt_required, get_jwt_identity
from authlib.integrations.flask_client import OAuth
import certifi


# User Registration
@auth_routes.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not is_valid_email(data["email"]):
        return jsonify({"msg": "Invalid email format"}), 400

    if not is_strong_password(data["password"]):
        return jsonify({"msg": "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character"}), 400

    if users_collection.find_one({"email": data["email"]}):
        return jsonify({"msg": "Email already registered"}), 409
    
    hashed_password = generate_hash_password(data["password"])

    new_user = {
        "full_name": data["full_name"],
        "email": data["email"],
        "username": data["username"],
        "password": hashed_password,
        "test_results": {},  
        "chatbot_preference": None
    }

    users_collection.insert_one(new_user)
    return jsonify({"msg": "User registered successfully"}), 201

# User Login
@auth_routes.route("/login", methods=["POST"])
def login():
    # ✅ Ensure the request is JSON
    if not request.is_json:
        return jsonify({"msg": "Request must be JSON"}), 415  # Return 415 error explicitly

    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"msg": "Missing email or password"}), 400

    user = users_collection.find_one({"email": data["email"]})
    if not user:
        return jsonify({"msg": "User not found"}), 404

    if verify_password(data["password"], user["password"]):
        access_token = generate_token(user["email"])
        response = jsonify({"msg": "Login successful", "access_token": access_token})

        # ✅ Set CORS headers explicitly
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="None")

        return response, 200

    return jsonify({"msg": "Incorrect password"}), 401

# Forgot Password
@auth_routes.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    user = users_collection.find_one({"email": data["email"]})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    reset_token = secrets.token_urlsafe(32)
    hashed_reset_token = generate_hash_token(reset_token)
    
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=10) 


    # Store reset token and expiry time
    users_collection.update_one(
        {"email": data["email"]},
        {"$set": {"reset_token": hashed_reset_token, "reset_token_expiry": expiration_time}}
    )

    send_reset_email(data["email"], reset_token)
    return jsonify({"msg": "Password reset email sent"}), 200


@auth_routes.route("/reset-password/<token>", methods=["POST"])
# @jwt_required
def reset_password(token):
    # current_user = get_jwt_identity()
    hashed_token = generate_hash_token(token)
    data = request.get_json()
    user = users_collection.find_one({"reset_token": hashed_token})

    if not user:
        return jsonify({"msg": "Invalid or expired token"}), 400

    if "reset_token_expiry" in user:
        expiry = user["reset_token_expiry"]
        if expiry.tzinfo is None:
            expiry = expiry.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) > expiry:
        return jsonify({"msg": "Token expired"}), 400

    # Hash the new password
    if(is_strong_password(data["new_password"])):
        hashed_password = generate_hash_password(data["new_password"])

        users_collection.update_one(
        {"email": user["email"]},
        {"$set": {"password": hashed_password}, "$unset": {"reset_token": "", "reset_token_expiry": ""}}
    )

        return jsonify({"msg": "Password updated successfully"}), 200
    else:
        return jsonify({"msg": "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character"}), 400

    # Update password and remove reset token


@auth_routes.route("/login/google", methods=["GET"])
def login_google():
    try:
        print("Yo reached login part")
        CLIENT_ID='625117762742-occ7rvnho6rpdremg286j4gvegbsdh9u.apps.googleusercontent.com'
        CLIENT_SECRET='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'
        app = create_app()
        oauth = OAuth(app)
        google = oauth.register(
        name='google',
        client_id=CLIENT_ID,
        client_secret=CLIENT_SECRET,
        server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
        client_kwargs={'scope': 'openid profile email'},)
        print("Going for redirect url")
        redirect_uri = url_for('auth_routes.authorize_google', _external=True)
        print(f"Got url {redirect_uri}")
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        app = create_app()
        app.logger.error(f"Error during login: {str(e)}")
        return "Error occurred during login", 500


@auth_routes.route("/authorize/google", methods=["GET"])
def authorize_google():
    CLIENT_ID='625117762742-occ7rvnho6rpdremg286j4gvegbsdh9u.apps.googleusercontent.com'
    CLIENT_SECRET='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'
    app = create_app()
    oauth = OAuth(app)
    google = oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'},)
    token = google.authorize_access_token()
    print("Received token")
    userinfo_endpoint = google.server_metadata['userinfo_endpoint']
    print("Received userinfo")
    resp = google.get(userinfo_endpoint,verify=certifi.where())
    print("Received responses")
    user_info = resp.json()
    print(resp.json())
    username = user_info['given_name']
    full_name = user_info['name']
    email = user_info['email']
    # MONGO_URI = "mongodb+srv://username:Password@cluster0.mrvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" # Ensure this variable is set in your environment

    # Connect to MongoDB
    # client = MongoClient(MONGO_URI)
    # db = client["Mydatabase"]  # Ensure this matches your actual database name

    # User Collection
    # users_collection = db["users"]
    user_data = users_collection.find_one({'username': username})
    print("Received user data")
    if not user_data:
        print("New user")
        new_user = {
                "full_name": full_name,
                "email": email,
                "username": username,
                "password": "123",
            }
        users_collection.insert_one(new_user)
        print("User entered")

    print("User exist")
    return redirect("http://localhost:3000/")
  # Redirect to a dashboard or home page


