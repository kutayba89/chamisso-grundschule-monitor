import requests
from bs4 import BeautifulSoup


HEADERS = {
    "User-Agent": "Mozilla/5.0 (School Event Monitor)"
}


def fetch_page(url):
    try:
        response = requests.get(
            url,
            headers=HEADERS,
            timeout=20
        )

        response.raise_for_status()

        soup = BeautifulSoup(response.text, "lxml")

        # Remove elements that don't contain useful page content
        for element in soup(["script", "style", "noscript"]):
            element.decompose()

        text = soup.get_text(
            separator=" ",
            strip=True
        )

        return text

    except requests.RequestException as e:
        print(f"ERROR: Could not fetch {url}")
        print(f"       {e}")
        return None
