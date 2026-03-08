-- Index for user table
CREATE INDEX IF NOT EXISTS idx_users_email
on users (email);

-- Index for session tables
CREATE INDEX IF NOT EXISTS idx_sessions_guest
on sessions (tmdb_guest_session_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user
on sessions (tmdb_user_session_id);

-- Index for movie_watchlist table
CREATE INDEX IF NOT EXISTS idx_sessions_created
on sessions (created_at);
