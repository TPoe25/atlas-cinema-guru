#!/usr/bin/env python3
"""
TV Series routes for interacting with TMDB TV endpoints.
"""

from flask import Blueprint, jsonify, request
from api.tmdb_client import tmdb_get, tmdb_post, tmdb_delete
from api.extensions import cache

bp = Blueprint("tv", __name__, url_prefix="/tv")

@bp.get("/tv")
@cache.cached(timeout=300)
def trending_all():
    data, status = tmdb_get("/trending/all/day")
    return jsonify(data), status

@bp.get("/<int:tv_id>")
def tv_details(tv_id):
    """
    Get TV series details
    ---
    tags:
      - TV
    parameters:
      - in: path
        name: tv_id
        required: true
        schema:
          type: integer
    responses:
      200:
        description: TV details
    """
    data, status = tmdb_get(f"/tv/{tv_id}")
    return jsonify(data), status


@bp.get("/<int:tv_id>/recommendations")
def tv_recommendations(tv_id):
    """
    Get TV recommendations
    ---
    tags:
      - TV
    parameters:
      - in: query
        name: page
        schema:
          type: integer
          default: 1
    """
    page = max(1, min(request.args.get("page", 1, type=int), 50))
    data, status = tmdb_get(f"/tv/{tv_id}/recommendations", params={"page": page})
    return jsonify(data), status

@bp.get("/search")
def search_tv():
    """
    Search TV series by title
    ---
    tags:
      - TV
    parameters:
      - in: query
        name: q
        required: true
        schema:
          type: string
        description: TV show search query (e.g. breaking bad)
      - in: query
        name: page
        required: false
        schema:
          type: integer
          default: 1
        description: Page number for pagination
      - in: query
        name: first_air_date_year
        required: false
        schema:
          type: integer
        description: Filter by first air date year
    responses:
      200:
        description: TV search results
      400:
        description: Missing query parameter
    """
    query = request.args.get("q", type=str)
    page = request.args.get("page", 1, type=int)
    page = max(1, min(page, 500))
    year = request.args.get("first_air_date_year", type=int)

    if not query:
        return jsonify({"error": "Missing required query param: q"}), 400

    params = {
        "query": query,
        "page": page,
    }

    if year:
        params["first_air_date_year"] = year

    data, status = tmdb_get("/search/tv", params=params)
    return jsonify(data), status

@bp.get("/<int:tv_id>/reviews")
def tv_reviews(tv_id):
    """
    Get TV reviews
    ---
    tags:
      - TV
    """
    page = max(1, min(request.args.get("page", 1, type=int), 50))
    data, status = tmdb_get(f"/tv/{tv_id}/reviews", params={"page": page})
    return jsonify(data), status

@bp.get("/<int:tv_id>/keywords")
def tv_keywords(tv_id):
    """
    Get TV keywords
    ---
    tags:
      - TV
    """
    data, status = tmdb_get(f"/tv/{tv_id}/keywords")
    return jsonify(data), status


@bp.get("/<int:tv_id>/similar")
def tv_similar(tv_id):
    """
    Get similar TV series
    ---
    tags:
      - TV
    """
    data, status = tmdb_get(f"/tv/{tv_id}/similar")
    return jsonify(data), status


@bp.post("/<int:tv_id>/rating")
def add_tv_rating(tv_id):
    """
    Add a rating to a TV series
    ---
    tags:
      - TV
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - value
              - session_id
            properties:
              value:
                type: number
                example: 8.0
              session_id:
                type: string
    """
    body = request.get_json() or {}
    value = body.get("value")
    session_id = body.get("session_id")

    if value is None or not session_id:
        return jsonify({"error": "Missing value or session_id"}), 400

    data, status = tmdb_post(
        f"/tv/{tv_id}/rating",
        json_body={"value": value},
        params={"session_id": session_id},
    )
    return jsonify(data), status


@bp.delete("/<int:tv_id>/rating")
def delete_tv_rating(tv_id):
    """
    Delete a TV rating
    ---
    tags:
      - TV
    requestBody:
      required: true
      content:
        application/json:
          schema:
            type: object
            required:
              - session_id
            properties:
              session_id:
                type: string
    """
    body = request.get_json() or {}
    session_id = body.get("session_id")

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400

    data, status = tmdb_delete(
        f"/tv/{tv_id}/rating",
        json_body=None,
    )
    return jsonify(data), status
