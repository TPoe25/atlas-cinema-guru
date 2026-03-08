#!/usr/bin/env python3
from flask import Blueprint, jsonify, request
from api.tmdb_client import tmdb_get
from api.extensions import cache

bp = Blueprint("trending", __name__, url_prefix="/trending")


def _page():
    p = request.args.get("page", 1, type=int)
    return max(1, min(p, 500))


@bp.get("/all")
@cache.cached(timeout=300)
def trending_all():
    data, status = tmdb_get("/trending/all/day", params={"page": _page()})
    return jsonify(data), status


@bp.get("/movies")
@cache.cached(timeout=300)
def trending_movies():
    data, status = tmdb_get("/trending/movie/day", params={"page": _page()})
    return jsonify(data), status


@bp.get("/tv")
@cache.cached(timeout=300)
def trending_tv():
    data, status = tmdb_get("/trending/tv/day", params={"page": _page()})
    return jsonify(data), status
