#!/usr/bin/env python3
from flask import Blueprint, jsonify, request
from api.tmdb_client import tmdb_get, tmdb_post, tmdb_delete
from api.extensions import db
from api.models.session import Session

DEFAULT_PAGE = 1
MAX_PAGE = 50

bp = Blueprint("auth", __name__, url_prefix="/auth")

@bp.get("/guest-session")
def guest_session():
    """
    Create guest session
    ---
    tags:
      - Auth
    """
    data, status = tmdb_get("/authentication/guest_session/new")
    if status == 200:
        db.session.add(Session(tmdb_guest_session_id=data["guest_session_id"]))
        db.session.commit()
    return jsonify(data), status


@bp.post("/login-session")
def login_session():
    """
    Create user login session
    ---
    tags:
      - Auth
    """
    body = request.get_json() or {}
    username = body.get("username")
    password = body.get("password")

    if not username or not password:
        return jsonify({"error": "Missing credentials"}), 400

    token_data, _ = tmdb_get("/authentication/token/new")
    token = token_data["request_token"]

    tmdb_post(
        "/authentication/token/validate_with_login",
        json_body={
            "username": username,
            "password": password,
            "request_token": token,
        },
    )

    session_data, status = tmdb_post(
        "/authentication/session/new",
        json_body={"request_token": token},
    )

    if status == 200:
        db.session.add(Session(tmdb_user_session_id=session_data["session_id"]))
        db.session.commit()

    return jsonify(session_data), status


@bp.delete("/logout")
def logout():
    """
    Delete session
    ---
    tags:
      - Auth
    """
    body = request.get_json() or {}
    session_id = body.get("session_id")

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    data, status = tmdb_delete(
        "/authentication/session",
        json_body={"session_id": session_id},
    )
    return jsonify(data), status
