FROM python:3.11-slim

WORKDIR /app

# 👉 COPIAR BACKEND REAL
COPY backend/ /app/

# 👉 DEPENDENCIAS
COPY pos-app/app/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000

# 👉 Django corre desde backend
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]