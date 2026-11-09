#!/bin/sh
# Runs the site locally. Open http://localhost:8000 afterwards. Stop with Ctrl+C.
cd "$(dirname "$0")" || exit 1
echo "Serving on http://localhost:8000"
python3 -m http.server 8000
