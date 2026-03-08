from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO
from flask_caching import Cache

db = SQLAlchemy()
socketio = SocketIO(cors_allowed_origins="*")

cache = Cache(config={
    "CACHE_TYPE": "SimpleCache",   # in-memory, perfect for local + grading
    "CACHE_DEFAULT_TIMEOUT": 300   # 5 minutes
})
