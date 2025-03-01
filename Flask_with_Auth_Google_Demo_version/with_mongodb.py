from flask import Flask, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from flask_pymongo import PyMongo
from authlib.integrations.flask_client import OAuth
from api_key import *
from pymongo import MongoClient
import certifi
import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

app = Flask(__name__)
app.secret_key = 'supersecretkey123'  # Change this to a random secret key

# Configuring MongoDB Atlas
# app.config['MONGO_URI'] = 'mongodb+srv://username:Password@cluster0.mrvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


client = MongoClient("mongodb+srv://username:Password@cluster0.mrvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["Mydatabase"]

# User Collection
users_collection = db["users"]
# mongo = PyMongo(app)

oauth = OAuth(app)

google = oauth.register(
    name='google',
    client_id=CLIENT_ID,
    client_secret=CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid profile email'},
)

class User:
    """User Model for MongoDB"""
    def __init__(self, username, password_hash=None):
        self.username = username
        self.password_hash = password_hash

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

@app.route('/')
def home():
    if 'username' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    user_data = users_collection.find_one({'username': username})
    
    if user_data and check_password_hash(user_data['password_hash'], password):
        session['username'] = username
        return redirect(url_for('dashboard'))
    else:
        return render_template('index.html', error='Invalid username or password.')

@app.route('/register', methods=['POST'])
def register():
    username = request.form['username']
    password = request.form['password']
    user_data = users_collection.find_one({'username': username})
    
    if user_data:
        return render_template('index.html', error='Username already exists.')
    else:
        new_user = User(username)
        new_user.set_password(password)
        users_collection.insert_one({'username': new_user.username, 'password_hash': new_user.password_hash})
        session['username'] = username
        return redirect(url_for('dashboard'))

@app.route('/dashboard')
def dashboard():
    if 'username' in session:
        return render_template('dashboard.html', username=session['username'])
    return redirect(url_for('home'))

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

@app.route('/login/google')
def login_google():
    try:
        print("Reached before riderect")
        redirect_uri = url_for('authorize_google', _external=True)
        print("Reached after riderect")
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        app.logger.error(f"Error during login: {str(e)}")
        return "Error occurred during login", 500

@app.route("/authorize/google")
def authorize_google():
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

    session['username'] = username
    session['oauth_token'] = token

    return redirect(url_for('dashboard'))

if __name__ == '__main__':
    app.run(debug=True)



# uri = "mongodb+srv://username:Password@cluster0.mrvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

#     # # Create a new client and connect to the server
#     # client = MongoClient(uri, server_api=ServerApi('1'))

#     # # Send a ping to confirm a successful connection
#     # try:
#     #     client.admin.command('ping')
#     #     print("Pinged your deployment. You successfully connected to MongoDB!")
#     # except Exception as e:
#     #     print(e)



# MONGO_URI = "mongodb+srv://username:Password@cluster0.mrvq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0" # Ensure this variable is set in your environment
