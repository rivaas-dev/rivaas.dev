#!/usr/bin/env bash
# Record all three casts in order. Run from demo/: ./scripts/record-all.sh
# Requires: expect, asciinema, bat, jq, go

set -e
cd "$(dirname "$0")/.."

# Check prerequisites
for cmd in expect asciinema bat jq go; do
    command -v "$cmd" > /dev/null || { echo "Missing: $cmd"; exit 1; }
done

echo "Recording write.cast..."
expect scripts/record-write.exp

echo "Recording run.cast..."
expect scripts/record-run.exp

echo "Recording use.cast (server started automatically)..."
./scripts/record-use.sh

echo "Done. Casts written to src/public/casts/"
ls -la ../src/public/casts/*.cast 2>/dev/null || true
