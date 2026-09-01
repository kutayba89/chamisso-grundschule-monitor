from monitor.config import load_schools


def main():
    schools = load_schools()

    print("=" * 55)
    print("CHAMISSO SCHOOL MONITOR")
    print("=" * 55)
    print(f"Schools loaded: {len(schools)}")
    print()

    for school in schools:
        print(f"🏫 {school['name']}")

        for url in school["urls"]:
            print(f"   → {url}")

        print()


if __name__ == "__main__":
    main()
