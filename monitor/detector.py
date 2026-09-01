import re


KEYWORDS = [
    "tag der offenen tür",
    "tag der offenen tuer",
    "offener tag",
    "offene tür",
    "offene tuer",
    "schulbesichtigung",
    "schulführung",
    "schulführungen",
    "schulfuehrung",
    "schulfuehrungen",
    "informationsveranstaltung",
    "informationsveranstaltungen",
    "informationsabend",
    "elterninformationsabend",
    "grundschultag",
    "türöffnertag",
    "tueroeffnertag",
    "tag der offenen schule",
    "offene schule",
    "kennenlerntag",
    "kennenlernnachmittag",
    "kennenlernabend",
    "besichtigung der schule",
    "schulrundgang",
    "schulbesuch",
    "schule kennenlernen",
    "informationstag",
    "informationstag schule",
    "infotag",
]


def normalize_text(text):
    """
    Normalize text so that searches are easier.
    """

    text = text.lower()

    # Replace German umlauts with their ASCII equivalents
    replacements = {
        "ä": "ae",
        "ö": "oe",
        "ü": "ue",
        "ß": "ss",
    }

    for old, new in replacements.items():
        text = text.replace(old, new)

    # Replace multiple spaces/newlines with one space
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def detect_keywords(text):
    """
    Return all keywords found in the page text.
    """

    normalized_text = normalize_text(text)

    found = []

    for keyword in KEYWORDS:
        normalized_keyword = normalize_text(keyword)

        if normalized_keyword in normalized_text:
            found.append(keyword)

    return found
