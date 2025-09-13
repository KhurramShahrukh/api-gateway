#!/bin/bash

echo "🛑 Stopping all microservices..."

# Stop and remove containers
docker-compose down

# Remove unused images (optional)
read -p "Do you want to remove unused Docker images? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker image prune -f
fi

echo "✅ All services stopped!"
