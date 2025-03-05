from flask_mail import Mail, Message
from flask import current_app as app

mail = Mail()

def send_reset_email(email, token):
    with app.app_context():
        msg = Message("Password Reset Request", sender=app.config["MAIL_USERNAME"], recipients=[email])
        msg.body = f"Click the link to reset your password: http://localhost:3000/reset_password/{token}"
        mail.send(msg)


# Create a new page for http://localhost:127.0.0:5000/reset-password/{token}  which contains password and contains password