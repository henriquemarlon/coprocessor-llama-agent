#!/bin/bash

check_health() {
    curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/health
}

echo "Starting Rust server..."
/usr/local/bin/http-server &

echo "Waiting for Rust server to be healthy..."
until [ "$(check_health)" -eq 200 ]; do
  echo "Rust server not ready yet. Retrying in 2 seconds..."
  sleep 2
done

echo "Rust server is up. Starting Node.js application..."

node /app/dist/index.js