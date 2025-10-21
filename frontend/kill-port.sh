#!/bin/bash

# Script to kill any process using port 5173
# This ensures HealthMate frontend can always start

PORT=5173

echo "🔍 Checking if port $PORT is in use..."

# Find process using the port
PID=$(lsof -ti :$PORT)

if [ -z "$PID" ]; then
    echo "✅ Port $PORT is free!"
else
    echo "⚠️  Port $PORT is being used by process $PID"
    echo "🔫 Killing process..."
    kill -9 $PID

    # Wait a moment
    sleep 1

    # Verify it's killed
    if lsof -ti :$PORT > /dev/null 2>&1; then
        echo "❌ Failed to kill process on port $PORT"
        exit 1
    else
        echo "✅ Successfully killed process on port $PORT"
    fi
fi

echo "🚀 Port $PORT is ready for HealthMate!"
