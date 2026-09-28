# Image for the Celery worker: Linux + Python 3.12 + our dependencies, installed with uv.
FROM python:3.12-slim

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
USER appuser

CMD ["celery", "-A", "config", "worker", "--loglevel=info"]
