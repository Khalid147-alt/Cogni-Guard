# Use an official Python runtime as a parent image
FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install system dependencies (ffmpeg)
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY backend/requirements.txt .

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY backend ./backend

# Expose the port that the application listens on
# Railway sets the PORT environment variable, defaulting to 8000 if not set
ENV PORT=8000
EXPOSE $PORT

# Run the application
CMD ["sh", "-c", "uvicorn backend.server:app --host 0.0.0.0 --port ${PORT}"]
