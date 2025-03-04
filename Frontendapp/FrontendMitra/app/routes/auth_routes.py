from app import create_app
from flask import make_response, redirect, request, jsonify, url_for
from app.models import users_collection , chats_collection
from app.utils.mail import send_reset_email
import secrets
from app.routes import auth_routes
from datetime import datetime , timedelta 
from datetime import datetime, timedelta, timezone
from app.utils.security import  *
from authlib.integrations.flask_client import OAuth
import certifi
import uuid
import jwt

# User Registration
@auth_routes.route("/register", methods=["POST"])
def register():
    user = request.get_json()

    if not is_valid_username(user["username"]):
        return jsonify({"msg": "Username must be at least 5 characters long, start with a letter, and contain only letters, numbers, or underscores"}), 400
    
    # if is_valid_username(user["username"]):
        
    #         return jsonify({"msg": "Username already exists"}), 400

    if not is_valid_email(user["email"]):
        return jsonify({"msg": "Invalid email format"}), 400

    if not is_strong_password(user["password"]):
        return jsonify({"msg": "Password must be at least 8 characters long, include a number, an uppercase letter, and a special character"}), 400

    if users_collection.find_one({"email": user["email"]}):
        return jsonify({"msg": "Email already registered"}), 409
    
    hashed_password = generate_hash_password(user["password"])

    user_id = str(uuid.uuid4())

    new_user = {
        "user_id": user_id,  # Added unique user ID
        "full_name": user["full_name"],
        "email": user["email"],
        "username": user["username"],
        "password": hashed_password,
        "test_results": {},  
        "chatbot_preference": None
        # "chat_history": []  # Added empty list for storing chatbot interactions
    }

    users_collection.insert_one(new_user)
    access_token = generate_token(user["email"])

    response = make_response(jsonify({"msg": f"{user["username"]} registered successfully", "user_id": user_id}))
    response.set_cookie("user_id", user_id, httponly=True, secure=False, samesite="None")
    response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="None")  

    print(response.headers)
    return response, 201



# User Login
@auth_routes.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = users_collection.find_one({"email": data["email"]})
    if not user:
        return jsonify({"msg": "User not found"}), 404

    # Check for too many failed login attempts
    if user.get("failed_attempts", 0) >= 5:
        return jsonify({"msg": "Account locked due to multiple failed login attempts. Try again later."}), 403

    # Verify password
    if verify_password(data["password"], user["password"]):

        # Reset failed attempts
        users_collection.update_one({"email": user["email"]}, {"$set": {"failed_attempts": 0}})

        # Generate tokens
        access_token = generate_token(user["email"])
        user_id = user["user_id"]  # Fetch user_id from DB

        # Create response with secure HTTP-only cookies
        response = make_response(jsonify({"msg": "Login successful", "access_token": access_token, "user_id": user_id}), 200)
        response.set_cookie("access_token", access_token, httponly=True, secure=False, samesite="None")
        response.set_cookie("user_id", user_id, httponly=True, secure=False, samesite="None")

        print(response.headers)

        return response
    
    # Increment failed attempts if password is incorrect
    users_collection.update_one({"email": user["email"]}, {"$inc": {"failed_attempts": 1}})
    return jsonify({"msg": "Incorrect password"}), 401

# Forgot Password
@auth_routes.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()

    
    field="email"
    user = users_collection.find_one({"email": data["email"]})

    if not user:
        user = users_collection.find_one({"email": data["username"]})
        field="username"

    if not user:
        return jsonify({"msg": "Not a valid Email/Username"}), 404


    reset_token = secrets.token_urlsafe(32)
    hashed_reset_token = generate_hash_token(reset_token)
    expiration_time = datetime.now(timezone.utc) + timedelta(minutes=10) 
    
    if(field=="email"):
        users_collection.update_one(
        {"email": data["email"]},
        {"$set": {"reset_token": hashed_reset_token, "reset_token_expiry": expiration_time}}
    )

        send_reset_email(data["email"], reset_token)
        return jsonify({"msg": f"Password reset email sent to {data["email"]}"}), 200

    if(field=="username"):

    
        users_collection.update_one(
            {"username": data["username"]},
            {"$set": {"reset_token": hashed_reset_token, "reset_token_expiry": expiration_time}}
        )

        user = users_collection.find_one({"username": data["username"]})

        send_reset_email(user["email"], reset_token)
        return jsonify({"msg": f"Password reset email sent to {user["email"]}"}), 200


@auth_routes.route("/reset-password/<token>", methods=["POST"])
# @jwt_required
def reset_password(token):

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




@auth_routes.route("/api/chat", methods=["POST"])
def chat():

    data = request.get_json()
    message = data["message"]
    # user_id = request.cookies.get("user_id")  # Fetch user_id from cookies

    # if not user_id:
    #     print("Did not find the user_id")
    #     return jsonify({"error": "Unauthorized"}), 401


    response_text  , sentiment_score = generate_llm_response_sentiment(message)
    print(response_text)
    chat_entry = {
        "user_id": "111",
        "user_message": message,
        "bot_response": response_text,
        "timestamp": datetime.now(timezone.utc),
        "sentiment_score" : sentiment_score
    }

    chats_collection.insert_one(chat_entry)

    return jsonify({"reply": response_text , "sentiment_score": sentiment_score} )



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
    user_data = users_collection.find_one({'email': email})
    print("Received user data")
    if not user_data:
        print("New user")
        user_id = str(uuid.uuid4())
        new_user = {
                "user_id" : user_id,
                "full_name": full_name,
                "email": email,
                "username": username,
                "password": "none",
                "test_results": {},  
                "chatbot_preference": None
            }
        users_collection.insert_one(new_user)
        print("User entered")
    else:
        print("User exist")
    return redirect("http://localhost:3000/")


@auth_routes.route("/get-username", methods=["POST"])
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