#!/usr/bin/env bash
# Start the app, run record-use.exp, then stop the app.
# Run from demo/: ./scripts/record-use.sh

set -e
cd "$(dirname "$0")/.."

# Build the binary first (ensures clean process management)
echo "Building demo app..."
go build -o /tmp/demo-api main.go

# Run the binary directly
/tmp/demo-api > /dev/null 2>&1 &
pid=$!

# Trap to ensure cleanup
trap "kill $pid 2>/dev/null || true; rm -f /tmp/demo-api" EXIT INT TERM

echo "Waiting for server to start..."
for i in $(seq 1 30); do
    if curl -s http://localhost:8080/openapi.json > /dev/null 2>&1; then
        echo "Server ready"
        break
    fi
    sleep 0.5
done

echo "Recording use.cast..."
expect scripts/record-use.exp || true
