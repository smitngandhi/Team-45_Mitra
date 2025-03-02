from flask import jsonify, request
from app.routes import chatbot_routes
from app.models import db
import datetime as datetime

@chatbot_routes.route("/api/chatbot/preference", methods=["GET"])
def get_chatbot_preference():
    username = request.args.get("username")
    user = db.users.find_one({"username": username}, {"_id": 0, "chatbot_preference": 1})

    if user:
        return jsonify({"chatbot_preference": user["chatbot_preference"]})
    else:
        return jsonify({"error": "User not found."}), 404

# Change chatbot preference manually
@chatbot_routes.route("/api/chatbot/preference", methods=["POST"])
def set_chatbot_preference():
    data = request.json                                                             
    username = data["username"]
    chatbot_type = data["chatbot_preference"]

    db.users.update_one(
        {"username": username},
        {"$set": {"chatbot_preference": chatbot_type}}
    )

    return jsonify({"message": "Chatbot preference updated successfully."})