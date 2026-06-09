FROM python:3.14-slim

WORKDIR /app

COPY pyproject.toml uv.lock ./
COPY src/ ./src/
COPY data/ ./data/
COPY app.py .

RUN pip install --no-cache-dir uv && \
    uv sync --no-dev --frozen

EXPOSE 8000

CMD ["uv", "run", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
