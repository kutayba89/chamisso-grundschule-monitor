import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SCHOOLS_FILE = BASE_DIR / "config" / "schools.json"


def load_schools():
    with open(SCHOOLS_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data["schools"]
