from flask import jsonify, request
from app.routes import test_routes
from app.models import db
import datetime as datetime
from app.utils.chatbot_logic import determine_chatbot_type

PHQ_9_QUESTIONS = [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling or staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself - or that you are a failure?",
    "Trouble concentrating on things?",
    "Moving or speaking so slowly?",
    "Thoughts that you would be better off dead or hurting yourself?"
]

GAD_7_QUESTIONS = [
    "Feeling nervous, anxious, or on edge?",
    "Not being able to stop or control worrying?",
    "Worrying too much about different things?",
    "Trouble relaxing?",
    "Being so restless that it is hard to sit still?",
    "Becoming easily annoyed or irritable?",
    "Feeling afraid as if something awful might happen?"
]

# Fetch Questions
@test_routes.route("/api/tests/phq9", methods=["GET"])
def get_phq9_questions():
    return jsonify({"questions": PHQ_9_QUESTIONS})

@test_routes.route("/api/tests/gad7", methods=["GET"])
def get_gad7_questions():
    return jsonify({"questions": GAD_7_QUESTIONS})

# Submit Test Answers
@test_routes.route("/api/tests/submit", methods=["POST"])
def submit_test():
    data = request.json
    username = data["username"]
    test_type = data["test_type"]  # e.g., "PHQ-9" or "GAD-7"
    answers = data["answers"]  # List of scores (0-3)

    total_score = sum(answers)
    chatbot_type = determine_chatbot_type(test_type, total_score)

    # Store results in database
    db.users.update_one(
        {"username": username},
        {"$set": {
            f"test_results.{test_type}": {"score": total_score, "date": datetime.now().isoformat()},
            "chatbot_preference": chatbot_type
        }}
    )

    return jsonify({"score": total_score, "recommended_chatbot": chatbot_type})