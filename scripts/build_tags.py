
from pathlib import Path
from html.parser import HTMLParser
import json
from urllib.parse import quote

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "tags.json"

EXCLUDED = {"tags", "scripts", ".git", ".github"}


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.tags = []
        self.in_title = False
        self.in_h1 = False
        self.h1 = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)

        if tag == "meta" and attrs.get("name", "").lower() == "tags":
            self.tags = [
                t.strip() for t in attrs.get("content", "").split(",")
                if t.strip()
            ]

        if tag == "title":
            self.in_title = True

        if tag == "h1":
            self.in_h1 = True

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_h1:
            self.h1 += data

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "h1":
            self.in_h1 = False


articles = []

for file in ROOT.rglob("*.html"):
    relative = file.relative_to(ROOT)

    if any(part in EXCLUDED for part in relative.parts):
        continue

    if relative.as_posix() == "index.html":
        continue

    parser = PageParser()
    parser.feed(file.read_text(encoding="utf-8"))

    if not parser.tags:
        continue

    title = parser.title.strip() or parser.h1.strip() or file.parent.name

    articles.append({
        "title": title,
        "url": quote(relative.as_posix(), safe="/"),
        "tags": parser.tags
    })

articles.sort(key=lambda a: a["title"].lower())

OUTPUT.write_text(
    json.dumps({"articles": articles}, ensure_ascii=False, indent=2),
    encoding="utf-8"
)

print(f"{len(articles)} Artikel mit Tags gefunden.")
print(f"Datei erstellt: {OUTPUT}")
