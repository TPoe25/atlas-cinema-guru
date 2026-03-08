#!/usr/bin/env python3
"""
Utility functions for interacting with the TMDB API.
Ensures clean responses and avoids storing unnecessary upstream data.
"""

from typing import Any
import requests
from flask import current_app

TMDB_BASE_URL = "https://api.themoviedb.org/3"

_session = requests.Session()


def _headers() -> dict[str, str] | None:
    token = current_app.config.get("TMDB_READ_TOKEN")
    if not token:
        current_app.logger.error("TMDB_READ_TOKEN is not configured")
        return None
    return {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json;charset=utf-8",
    }


def _timeout() -> int:
    return current_app.config.get("TMDB_REQUEST_TIMEOUT", 15)


def _handle_error(resp: requests.Response) -> tuple[dict, int]:
    try:
        payload = resp.json()
        message = payload.get("status_message", "TMDB error")
    except ValueError:
        message = "Upstream TMDB error"
    return {"error": message}, resp.status_code


def tmdb_get(
    path: str,
    params: dict[str, Any] | None = None
) -> tuple[dict, int]:
    headers = _headers()
    if headers is None:
        return {"error": "Server misconfiguration"}, 500

    resp = _session.get(
        f"{TMDB_BASE_URL}{path}",
        headers=headers,
        params=params,
        timeout=_timeout(),
    )

    if resp.status_code >= 400:
        return _handle_error(resp)

    return resp.json(), resp.status_code


def tmdb_post(
    path: str,
    json_body: dict[str, Any] | None = None,
    params: dict[str, Any] | None = None,
) -> tuple[dict, int]:
    headers = _headers()
    if headers is None:
        return {"error": "Server misconfiguration"}, 500

    resp = _session.post(
        f"{TMDB_BASE_URL}{path}",
        headers=headers,
        json=json_body,
        params=params,
        timeout=_timeout(),
    )

    if resp.status_code >= 400:
        return _handle_error(resp)

    return resp.json(), resp.status_code


def tmdb_delete(
    path: str,
    json_body: dict[str, Any] | None = None,
) -> tuple[dict, int]:
    headers = _headers()
    if headers is None:
        return {"error": "Server misconfiguration"}, 500

    resp = _session.delete(
        f"{TMDB_BASE_URL}{path}",
        headers=headers,
        json=json_body,
        timeout=_timeout(),
    )

    if resp.status_code >= 400:
        return _handle_error(resp)

    try:
        return resp.json(), resp.status_code
    except ValueError:
        return {"success": True}, resp.status_code
