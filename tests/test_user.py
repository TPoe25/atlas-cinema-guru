#!/usr/bin/env python3
from api.app import create_app
from api.extensions import db
from api.models.user import User
import hashlib

app = create_app()

with app.app_context():
    if not User.query.filter_by(email="test@example.com").first():
        user = User(
            email="test@example.com",
            password_hash=hashlib.sha256(b"testpassword").hexdigest(),
        )
        db.session.add(user)
        db.session.commit()
        print("Test user created")
    else:
        print("Test user already exists")
