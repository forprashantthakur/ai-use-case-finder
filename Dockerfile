# Monorepo root: Railway builds from repo root by default — copy only the API from backend/.
FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8001

# Railway sets PORT; match it in Variables if Networking shows a specific port (e.g. 8080).
CMD ["sh", "-c", "exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
