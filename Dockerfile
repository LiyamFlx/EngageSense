# Use a Python base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy application files
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose the port
EXPOSE 5000

# Start the application
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
