FROM python:3.12-slim

WORKDIR /app

# System deps for building some python packages (bcrypt, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Directory for the SQLite db / logs to live in a mounted volume
RUN mkdir -p /app/instance

EXPOSE 5000

CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:5000", "--access-logfile", "-", "--error-logfile", "-", "wsgi:app"]
