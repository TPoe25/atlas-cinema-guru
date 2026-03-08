#!/usr/bin/env python3
import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_UTL",
        "postgresql://localhost/tmdb_api"

    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SECRET_KEY = os.getenv("SECRET_KEY", "dev_secret_key")

    TMDB_API_KEY = os.getenv("TMDB_API_KEY")
    TMDB_READ_TOKEN = os.getenv("TMDB_READ_TOKEN")

    SWAGGER = {
        "title": "TMDB API companion",
        "description": (
            "<img src='/static/images/primary_logo.svg' width='200' alt='TMDB Logo'/><br>"
            " Use this API to search for movies, TV shows, and perform other operations."
        ),
        "uiversion": 3,
        "contact": {
            "name": "Taylor Poe",
            "email": "taylor.poe@atlasstudents.com"
        }
    }


if __name__ == "__main__":
    print(Config.TMDB_API_KEY)
