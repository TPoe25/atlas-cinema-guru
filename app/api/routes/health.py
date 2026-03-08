#!/usr/bin/env python3
from flask import Blueprint, jsonify, current_app

DEFAULT_PAGE = 1
MAX_PAGE = 50

bp = Blueprint("health", __name__, url_prefix="/health")

@bp.get("")
def health():
    return jsonify({"status": "ok"}), 200


@bp.get("/env")
def health_env():
    """
    Debug env loading (TEMPORARY)
    """
    return jsonify({
        "TMDB_READ_TOKEN_loaded": bool(current_app.config.get("TMDB_READ_TOKEN")),
        "TMDB_API_KEY_loaded": bool(current_app.config.get("TMDB_API_KEY")),
        "DATABASE_URL_loaded": bool(current_app.config.get("SQLALCHEMY_DATABASE_URI")),
    }), 200
