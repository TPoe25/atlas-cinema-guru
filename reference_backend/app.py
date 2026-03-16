#!/usr/bin/env python3
from flask import Flask
from flasgger import Swagger # type: ignore

from api.config import Config
from api.extensions import db, socketio, cache

from api.routes.health import bp as health_bp
from api.routes.auth import bp as auth_bp
from api.routes.trending import bp as trending_bp
from api.routes.movies import bp as movies_bp
from api.routes.tv import bp as tv_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Logger
    app.logger.setLevel("INFO")

    # Extensions
    db.init_app(app)
    Swagger(app)
    socketio.init_app(app)
    cache.init_app(app)
    
    

    # Blueprints
    app.register_blueprint(health_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(trending_bp)
    app.register_blueprint(movies_bp)
    app.register_blueprint(tv_bp)

    # WebSocket test event
    @socketio.on("ping")
    def ping():
        return {"message": "pong"}

    return app


if __name__ == "__main__":
    app = create_app()
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
