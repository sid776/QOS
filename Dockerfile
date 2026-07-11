# QuantumOS API — Railway / production
FROM python:3.12-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md ./
COPY core ./core
COPY providers ./providers
COPY agents ./agents
COPY db ./db
COPY security ./security
COPY skills ./skills
COPY use_cases ./use_cases
COPY apps ./apps

RUN pip install --no-cache-dir -e ".[quantum]"

ENV PYTHONPATH=/app
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:' + __import__('os').environ.get('PORT','8000') + '/health')" || exit 1

CMD ["sh", "-c", "uvicorn apps.api.quantumos_api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
