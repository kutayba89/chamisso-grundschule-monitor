"""
Writes scraped monitoring results to data/events.json
so the dashboard can display them.
"""

import json
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# The dashboard fetches this file at runtime.
# We write it into dashboard/public so Vite copies it into the build,
# and also keep a copy in data/ for reference.
DATA_FILE = BASE_DIR / "data" / "events.json"
PUBLIC_FILE = BASE_DIR / "dashboard" / "public" / "events.json"


def _write_json(path, payload):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)


def save_results(results):
    """
    results: list of dicts shaped like
        {
            "name": "School name",
            "status": "Online" | "Offline",
            "events": [
                {
                    "title": str,
                    "date": str,
                    "time": str,
                    "type": [str, ...],
                    "url": str,
                },
                ...
            ],
        }
    """

    payload = {
        "last_checked": datetime.now().isoformat(timespec="seconds"),
        "schools": results,
    }

    _write_json(DATA_FILE, payload)
    _write_json(PUBLIC_FILE, payload)

    return payload