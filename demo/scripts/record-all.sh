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

# Normalise hardcoded terminal colours to the Rivaas palette.
# Replaces 256-colour and truecolor codes baked in by the recording terminal
# with palette-equivalent truecolor codes so the asciinema theme stays consistent.
echo "Normalising cast colours..."
for cast in ../src/public/casts/write.cast ../src/public/casts/run.cast ../src/public/casts/use.cast; do
    [ -f "$cast" ] || continue
    sed -i \
        -e 's/\\u001b\[38;5;240m/\\u001b[38;2;149;168;162m/g' \
        -e 's/\\u001b\[38;5;243m/\\u001b[38;2;149;168;162m/g' \
        -e 's/\\u001b\[38;2;255;85;85m/\\u001b[38;2;212;85;62m/g' \
        -e 's/\\u001b\[38;2;80;250;123m/\\u001b[38;2;63;175;152m/g' \
        "$cast"
done

echo "Done. Casts written to src/public/casts/"
ls -la ../src/public/casts/*.cast 2>/dev/null || true
