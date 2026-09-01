from monitor.config import load_schools
from monitor.scraper import fetch_page


def main():
    schools = load_schools()

    print("=" * 60)
    print("CHAMISSO SCHOOL MONITOR")
    print("=" * 60)

    print(f"Schools loaded: {len(schools)}")
    print()

    for school in schools:
        print(f"🏫 {school['name']}")

        for url in school["urls"]:
            print(f"   Checking: {url}")

            text = fetch_page(url)

            if text:
                print(f"   ✓ Page downloaded ({len(text)} characters)")
            else:
                print("   ✗ Failed")

        print()


if __name__ == "__main__":
    main()
