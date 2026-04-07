FROM python:3.12-slim

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Railway and other hosts set PORT
ENV PORT=8001
EXPOSE 8001

CMD uvicorn main:app --host 0.0.0.0 --port ${PORT}
