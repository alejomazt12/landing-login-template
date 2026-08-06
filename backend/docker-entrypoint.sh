#!/bin/sh
# Apply pending migrations, then hand over to the API process.
#
# Migrations run here rather than inside the app so a failed upgrade stops the
# container instead of leaving it serving against a half-built schema.
set -e

echo "Running database migrations..."
alembic upgrade head

echo "Starting API on port ${PORT:-3031}..."
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-3031}"
