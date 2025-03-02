

def determine_chatbot_type(test_type, score):
    if test_type == "PHQ-9":  # Depression test
        if score <= 4:
            return "friend"
        elif score <= 9:
            return "motivational coach"
        elif score <= 14:
            return "therapist"
        elif score <= 19:
            return "therapist + support system"
        else:
            return "supportive parent"

    elif test_type == "GAD-7":  # Anxiety test
        if score <= 4:
            return "friend"
        elif score <= 9:
            return "therapist"
        elif score <= 14:
            return "supportive mode"
        else:
            return "cognitive therapy"

    return "default"  # If test type isn't recognized
