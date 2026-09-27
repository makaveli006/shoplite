| Command | Purpose |
|---|---|
| `uv run django-admin --version` | Check the installed Django version |
| `uv run django-admin startproject config .` | Create the Django project structure |
| `uv run python manage.py runserver` | Start Django's development server |
| `uv run python manage.py check` | Check the project for configuration/model errors |
| `uv run python manage.py shell` | Open Django's Python shell |
| `uv run python manage.py shell -c "..."` | Run a Django-aware Python command directly |
| `uv run python manage.py showmigrations` | Show migrations and whether each has been applied |
| `uv run python manage.py makemigrations --dry-run --verbosity 3` | Preview the migration Django would generate without creating it |
| `uv run python manage.py makemigrations` | Generate migration files from model changes |
| `uv run python manage.py sqlmigrate accounts 0001` | Show the Structured Query Language that a migration would execute |
| `uv run python manage.py migrate` | Apply migrations to the database |
| `uv run python manage.py createsuperuser` | Create an administrator account |
| `uv run python manage.py startapp accounts` | Create the `accounts` Django application |
| `uv run python manage.py startapp catalog` | Create the `catalog` Django application |