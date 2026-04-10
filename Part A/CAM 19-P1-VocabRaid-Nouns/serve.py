import os, http.server, functools
port = int(os.environ.get("PORT", 3000))
handler = functools.partial(http.server.SimpleHTTPRequestHandler,
    directory=os.path.dirname(os.path.abspath(__file__)))
with http.server.HTTPServer(("", port), handler) as s:
    print(f"Serving on port {port}", flush=True)
    s.serve_forever()
