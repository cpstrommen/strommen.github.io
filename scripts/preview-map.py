#!/usr/bin/env python3
"""Serve the static site locally so map data fetches work in browser previews."""

from __future__ import annotations

import http.server
import socketserver
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
START_PORT = 8000


class ReusableTcpServer(socketserver.TCPServer):
    allow_reuse_address = True


def main() -> int:
    handler = http.server.SimpleHTTPRequestHandler
    server = None
    port = START_PORT
    while server is None:
        try:
            server = ReusableTcpServer(("", port), handler)
        except OSError:
            port += 1

    with server:
        print(f"Serving {ROOT}")
        print(f"Open http://localhost:{port}/map.html")
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped preview server")
    return 0


if __name__ == "__main__":
    import os

    os.chdir(ROOT)
    raise SystemExit(main())
