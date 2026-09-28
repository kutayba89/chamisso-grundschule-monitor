
from monitor.config import load_schools
from monitor.scraper import fetch_page
from monitor.detector import detect_keywords
from monitor.writer import save_results


def main():
    schools = load_schools()

    print("=" * 60)
    print("SCHOOL OPEN DAY MONITOR")
    print("=" * 60)

    print(f"Schools loaded: {len(schools)}")
    print()

    results = []
    total_events = 0

    for school in schools:
        print(f"[SCHOOL] {school['name']}")

        school_status = "Offline"
        school_events = []

        for url in school["urls"]:
            print(f"   Checking: {url}")

            text = fetch_page(url)

            if not text:
                print("   FAILED")
                continue

            # At least one URL responded successfully.
            school_status = "Online"

            print(f"   OK - Page downloaded ({len(text)} characters)")

            categories = detect_keywords(text)

            if categories:
                print("   EVENT FOUND!")

                for category in categories:
                    print(f"      -> {category}")

                # Group the detected categories into one event entry per URL.
                # Exact date/time parsing is not implemented yet.
                school_events.append(
                    {
                        "title": "Erkannte Veranstaltung",
                        "date": "Noch nicht erkannt",
                        "time": "",
                        "type": categories,
                        "url": url,
                    }
                )

                total_events += len(categories)

            else:
                print("   No relevant event found.")

        results.append(
            {
                "name": school["name"],
                "status": school_status,
                "events": school_events,
            }
        )

        print()

    payload = save_results(results)

    print("=" * 60)
    print(f"Total event categories found: {total_events}")
    print(f"Results saved. Last checked: {payload['last_checked']}")
    print("=" * 60)


if __name__ == "__main__":
    main()

