from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import users_collection
from app.routes import user_routes

# Protected Route Example
@user_routes.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    current_user_email = get_jwt_identity()
    user = users_collection.find_one({"email": current_user_email}, {"_id": 0, "password": 0})

    if not user:
        return jsonify({"msg": "User not found"}), 404

    return jsonify(user), 200
