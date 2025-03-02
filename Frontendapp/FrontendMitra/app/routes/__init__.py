from flask import Blueprint

auth_routes = Blueprint("auth_routes", __name__)
user_routes = Blueprint("user_routes", __name__)
test_routes = Blueprint("test", __name__)
chatbot_routes = Blueprint("chatbot", __name__)