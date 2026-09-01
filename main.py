
from monitor.config import load_schools
from monitor.scraper import fetch_page
from monitor.detector import detect_keywords


def main():
    schools = load_schools()

    print("=" * 60)
    print("CHAMISSO SCHOOL MONITOR")
    print("=" * 60)

    print(f"Schools loaded: {len(schools)}")
    print()

    total_events = 0

    for school in schools:
        print(f"[SCHOOL] {school['name']}")

        for url in school["urls"]:
            print(f"   Checking: {url}")

            text = fetch_page(url)

            if not text:
                print("   FAILED")
                continue

            print(f"   OK - Page downloaded ({len(text)} characters)")

            events = detect_keywords(text)

            if events:
                print("   EVENT FOUND!")

                for event in events:
                    print(f"      -> {event}")

                total_events += len(events)

            else:
                print("   No relevant event found.")

            # Debugging for Campus Hannah Höch
            if school["id"] == "campus-hannah-hoech":
                print()
                print("   DEBUG - Checking known event words:")

                test_words = [
                    "Informationsveranstaltungen",
                    "Schulführungen",
                    "Informationsveranstaltung",
                    "Schulführung",
                ]

                for word in test_words:
                    if word.lower() in text.lower():
                        print(f"      FOUND: {word}")
                    else:
                        print(f"      NOT FOUND: {word}")

        print()

    print("=" * 60)
    print(f"Total event categories found: {total_events}")
    print("=" * 60)


if __name__ == "__main__":
    main()

