# One Dockerfile, two images ("targets"), built from the same base:
#   worker (the default, used by docker-compose.yml): the Celery worker
#   web    (for servers):                            Django behind Gunicorn
# Build one with:  docker build --target web -t shoplite-web .

# ---------- base: Linux + Python 3.12 + our dependencies, installed with uv ----------
FROM python:3.12-slim AS base

# uv itself, copied from the official uv image (same version as on Windows).
COPY --from=ghcr.io/astral-sh/uv:0.12.19 /uv /uvx /bin/

ENV UV_LINK_MODE=copy \
    UV_COMPILE_BYTECODE=1 \
    UV_PYTHON_DOWNLOADS=0 \
    UV_PROJECT_ENVIRONMENT=/opt/venv \
    PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

# Install the dependencies from uv.lock first. This step is cached and only runs again
# when pyproject.toml or uv.lock change, so rebuilding after a code change is fast.
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --locked --no-install-project --no-dev

# Then the code.
COPY . /app

# Don't run as the all-powerful "root" user inside the container.
RUN useradd --create-home appuser

# ---------- web: Django served by Gunicorn ----------
FROM base AS web

# Collect the static files (the admin's CSS/JS) into the image now, so every container
# starts with them ready for WhiteNoise. Settings need these variables to load; these
# placeholder values exist only during the build and are never used to run anything.
RUN DJANGO_SECRET_KEY=build-only DB_NAME=build DB_USER=build DB_PASSWORD=build \
    python manage.py collectstatic --noinput

USER appuser
EXPOSE 8000
# Gunicorn: a production web server (runserver is only for development).
#   --workers 2: two processes answer requests in parallel (fits a 0.5 vCPU / 1 GB container)
#   --access-logfile -: one line per request to the output, which ends up in CloudWatch Logs
# Extra options can be given through the GUNICORN_CMD_ARGS environment variable.
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "60", "--access-logfile", "-"]

# ---------- worker: background jobs (the last stage = the default image) ----------
FROM base AS worker

USER appuser
CMD ["celery", "-A", "config", "worker", "--loglevel=info"]
