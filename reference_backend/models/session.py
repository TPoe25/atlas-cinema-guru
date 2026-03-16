#!/usr/bin/env python3
from api.extensions import db


class Session(db.Model):
    __tablename__ = "sessions"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=True,
    )

    tmdb_guest_session_id = db.Column(db.String(128), index=True)
    tmdb_user_session_id = db.Column(db.String(128), index=True)

    created_at = db.Column(
        db.DateTime,
        server_default=db.func.now(),
        nullable=False,
    )

    revoked_at = db.Column(db.DateTime, nullable=True)

    # Relationship → reference User by STRING ONLY
    user = db.relationship("User", backref="sessions")
