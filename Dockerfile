# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy files to container
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port
EXPOSE 5000

# Run application
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5000"]
