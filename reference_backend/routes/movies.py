#!/usr/bin/env python3
from flask import Blueprint, jsonify, request
from api.tmdb_client import tmdb_get, tmdb_post, tmdb_delete
from api.extensions import db, socketio, cache

DEFAULT_PAGE = 1
MAX_PAGE = 50

bp = Blueprint("movies", __name__, url_prefix="/movies")

@bp.get("/movies")
@cache.cached(timeout=300)
def trending_all():
    data, status = tmdb_get("/trending/all/day")
    return jsonify(data), status

@bp.get("/search")
def search_movies():
    """ Search movies by title
    ---
    tags:
      - Movies
    parameters:
      - in: "query"
        name: "q"
        required: "true"
        schema:
          type: "string"
        description: "Movie search query (ex: pulp fiction)"
      - in: "query"
        name: "page"
        required: "false"
        schema:
          type: "integer"
          default: "1"
        description: "Page number for pagination"
      - in: "query"
        name: "include_adult"
        required: "false"
        schema:
          type: "boolean"
          default: "false"
        description: "Include adult results"
      - in: "query"
        name: "year"
        required: "false"
        schema:
          type: "integer"
        description: "Filter by release year (optional)"
    responses:
      200:
        description: "Search results from TMDB"
      400:
        description: "Missing query"
    """
    query = request.args.get("q", type=str)
    page = request.args.get("page", 1, type=int)
    include_adult = request.args.get("include_adult", "false").lower() == "true"
    year = request.args.get("year", type=int)

    if not query:
        return jsonify({"error": "Missing required query param: q"}), 400

    params = {
        "query": query,
        "page": page,
        "include_adult": include_adult,
    }
    if year:
        params["year"] = year

    data, status = tmdb_get("/search/movie", params=params)
    return jsonify(data), status


@bp.get("/<int:movie_id>")
@cache.cached(timeout=300)
def movie_details(movie_id):
    """
    Get movie details
    ---
    tags:
      - Movies
    parameters:
      - in: "path"
        name: "movie_id"
        required: true
        schema: { type: "integer" }
    responses:
      200:
        description: "Movie details"
    """
    data, status = tmdb_get(f"/movie/{movie_id}")
    return jsonify(data), status


@bp.get("/<int:movie_id>/recommendations")
def movie_recommendations(movie_id):
    """
    Get movie recommendations
    ---
    tags:
      - Movies
    parameters:
      - in: "query"
        name: "page"
        schema: { type: "integer", default: "1" }
    """
    page = max(1, min(request.args.get("page", 1, type=int), 50))
    data, status = tmdb_get(f"/movie/{movie_id}/recommendations", params={"page": page})
    return jsonify(data), status


@bp.get("/<int:movie_id>/reviews")
def movie_reviews(movie_id):
    """
    Get movie reviews
    ---
    tags:
      - Movies
    """
    page = max(1, min(request.args.get("page", 1, type=int), 50))
    data, status = tmdb_get(f"/movie/{movie_id}/reviews", params={"page": page})
    return jsonify(data), status


@bp.post("/<int:movie_id>/rating")
def add_movie_rating(movie_id):
    """
    Add a rating to a movie
    ---
    tags:
      - Movies
    requestBody:
      required: "true"
      content:
        application/json:
          schema:
            type: "object"
            required: "[value, session_id]"
            properties:
              value: { type: "number", example: 8.5 }
              session_id: { type: "string" }
    """
    body = request.get_json() or {}
    value = body.get("value")
    session_id = body.get("session_id")

    if value is None or not session_id:
        return jsonify({"error": "Missing value or session_id"}), 400

    data, status = tmdb_post(
        f"/movie/{movie_id}/rating",
        json_body={"value": value},
        params={"session_id": session_id},
    )
    return jsonify(data), status


@bp.delete("/<int:movie_id>/rating")
def delete_movie_rating(movie_id):
    """
    Delete a movie rating
    ---
    tags:
      - Movies
    requestBody:
      required: "true"
      content:
        application/json:
          schema:
            type: "object"
            required: "[session_id]"
            properties:
              session_id: { type: "string" }
    """
    body = request.get_json() or {}
    session_id = body.get("session_id")

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    data, status = tmdb_delete(
        f"/movie/{movie_id}/rating",
        json_body=None,
    )
    return jsonify(data), status
