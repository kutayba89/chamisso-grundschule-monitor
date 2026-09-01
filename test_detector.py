from monitor.scraper import fetch_page
from monitor.detector import detect_keywords


url = "http://www.campus-hannah-hoech.de/"

print("Downloading page...")
text = fetch_page(url)

print()
print("Page length:", len(text))

print()
print("Searching for keywords...")

matches = detect_keywords(text)

print("Matches:", matches)

print()
print("Searching manually...")

for word in [
    "Informationsveranstaltungen",
    "Schulführungen",
    "Informationsveranstaltung",
    "Schulführung",
]:
    if word.lower() in text.lower():
        print(f"FOUND: {word}")
    else:
        print(f"NOT FOUND: {word}")
