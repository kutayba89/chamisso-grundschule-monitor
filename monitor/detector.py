
import re


KEYWORD_GROUPS = {
    "Tag der offenen Tür": [
        "tag der offenen tür",
        "tag der offenen tuer",
        "offener tag",
        "offene tür",
        "offene tuer",
        "tag der offenen schule",
        "offene schule",
    ],

    "Schulführung": [
        "schulbesichtigung",
        "schulführung",
        "schulführungen",
        "schulfuehrung",
        "schulfuehrungen",
        "schulrundgang",
        "besichtigung der schule",
    ],

    "Informationsveranstaltung": [
        "informationsveranstaltung",
        "informationsveranstaltungen",
        "informationsabend",
        "elterninformationsabend",
        "informationstag",
        "informationstag schule",
        "infotag",
    ],

    "Kennenlernen": [
        "kennenlerntag",
        "kennenlernnachmittag",
        "kennenlernabend",
        "schulbesuch",
        "schule kennenlernen",
    ],

    "Grundschultag": [
        "grundschultag",
    ],

    "Türöffnertag": [
        "türöffnertag",
        "tueroeffnertag",
    ],
}


def normalize_text(text):
    """
    Normalize text so German umlauts and
    different whitespace don't affect searches.
    """

    text = text.lower()

    replacements = {
        "ä": "ae",
        "ö": "oe",
        "ü": "ue",
        "ß": "ss",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


def detect_keywords(text):
    """
    Return unique event categories found
    on the page.
    """

    normalized_text = normalize_text(text)

    found = []

    for category, keywords in KEYWORD_GROUPS.items():

        for keyword in keywords:
            normalized_keyword = normalize_text(keyword)

            if normalized_keyword in normalized_text:
                found.append(category)
                break

    return found

