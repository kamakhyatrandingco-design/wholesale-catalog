FROM python:3.11-slim
WORKDIR /app
COPY main.py ./
EXPOSE 5004
ENV AI_PORT=5004 PYTHONUNBUFFERED=1
CMD ["python", "main.py"]
