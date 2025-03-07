from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from backend.config import Config
from authlib.integrations.flask_client import OAuth
import os

# Load environment variables
load_dotenv()

outh = OAuth()
# Initialize extensions (Do not attach to `backend` yet)
mail = Mail()
jwt = JWTManager()

# Initialize Flask backend
def create_backend():
    backend = Flask(__name__)

    config = Config()
    backend.config.from_object(config)

    
    # Initialize Extensions with backend
    outh.init_backend(backend)
    mail.init_backend(backend)
    jwt.init_backend(backend)
    # CORS(backend)

# ✅ Enable CORS Properly
    CORS(backend, origins="http://localhost:3000", supports_credentials=True)

    
    # Database Connection (Attach to backend)
    client = MongoClient(backend.config["MONGO_URL"])  # Get from config
    backend.db = client[backend.config["MONGO_DB_NAME"]]  # Store DB name in config

    # Register Blueprints
    from backend.routes.auth_routes import auth_routes
    from backend.routes.user_routes import user_routes
    from backend.routes.test_routes import test_routes
    from backend.routes.chatbot_routes import chatbot_routes

    backend.register_blueprint(auth_routes, url_prefix="/api/v1")
    backend.register_blueprint(user_routes, url_prefix="/api/v1")
    backend.register_blueprint(test_routes, url_prefix="/api/v1")
    backend.register_blueprint(chatbot_routes, url_prefix="/api/v1")

    return backend
