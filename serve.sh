#!/bin/sh
# Runs the site locally. Open http://localhost:8000 afterwards. Stop with Ctrl+C.
# Tells the browser never to cache, so code changes always show up on a normal refresh.
cd "$(dirname "$0")" || exit 1
echo "Serving on http://localhost:8000"
python3 -c '
import http.server, functools
class NoCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
http.server.ThreadingHTTPServer(("", 8000), NoCache).serve_forever()
'
