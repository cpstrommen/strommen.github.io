#!/usr/bin/env python3
"""Refresh assets/routes/airports.csv from public airport datasets."""

from __future__ import annotations

import csv
import io
import json
import re
import shutil
import subprocess
import sys
import tempfile
import urllib.request
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ROUTES_DIR = ROOT / "assets" / "routes"
AIRPORTS_CSV = ROUTES_DIR / "airports.csv"
OURAIRPORTS_URL = "https://davidmegginson.github.io/ourairports-data/airports.csv"
FAA_ENPLANEMENTS_XLSX = (
    "https://www.faa.gov/airports/planning_capacity/passenger_allcargo_stats/passenger/"
    "arp-cy2024-commercial-service-enplanements.xlsx"
)
BIGAIRPORTS_URL = "https://www.bigairports.com/"


def fetch(url: str) -> bytes:
    request = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 strommen-travel-map/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as file:
        return [{key: (value or "").strip() for key, value in row.items()} for row in csv.DictReader(file)]


def load_ourairports() -> list[dict[str, str]]:
    return list(csv.DictReader(io.StringIO(fetch(OURAIRPORTS_URL).decode("utf-8"))))


def airport_code(row: dict[str, str]) -> str:
    return row.get("icao_code") or row.get("gps_code") or row.get("ident") or row.get("iata_code") or row.get("local_code", "")


def index_ourairports(rows: list[dict[str, str]]) -> dict[str, list[dict[str, str]]]:
    index: dict[str, list[dict[str, str]]] = {}
    for row in rows:
        for key in ["ident", "icao_code", "gps_code", "iata_code", "local_code"]:
            value = (row.get(key) or "").strip()
            if value:
                index.setdefault(value, []).append(row)
    return index


def best_match(matches: list[dict[str, str]], prefer_country: str | None = None) -> dict[str, str] | None:
    if not matches:
        return None
    if prefer_country:
        country_matches = [row for row in matches if row.get("iso_country") == prefer_country]
        if country_matches:
            matches = country_matches
    scheduled = [row for row in matches if row.get("scheduled_service") == "yes"]
    if scheduled:
        matches = scheduled
    coded = [row for row in matches if airport_code(row)]
    if coded:
        matches = coded
    return matches[0]


def route_stop_codes() -> set[str]:
    codes: set[str] = set()
    for filename in ["flights.csv", "driving-trips.csv", "train-trips.csv"]:
        path = ROUTES_DIR / filename
        if not path.exists():
            continue
        for row in read_csv(path):
            if filename == "flights.csv":
                codes.update(filter(None, [row.get("origin", ""), row.get("destination", "")]))
            else:
                codes.update(stop.strip() for stop in row.get("stops", "").split("|") if stop.strip())
    return codes


def faa_rows() -> list[dict[str, str]]:
    workbook = zipfile.ZipFile(io.BytesIO(fetch(FAA_ENPLANEMENTS_XLSX)))
    ns = {"a": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
    shared_strings = []
    root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
    for item in root.findall("a:si", ns):
        shared_strings.append("".join(text.text or "" for text in item.iter("{http://schemas.openxmlformats.org/spreadsheetml/2006/main}t")))

    def cell_value(cell: ET.Element) -> str:
        value = cell.find("a:v", ns)
        if value is None:
            return ""
        raw = value.text or ""
        return shared_strings[int(raw)] if cell.get("t") == "s" else raw

    sheet = ET.fromstring(workbook.read("xl/worksheets/sheet1.xml"))
    rows = []
    headers: list[str] | None = None
    for row in sheet.findall(".//a:row", ns):
        values = [cell_value(cell) for cell in row.findall("a:c", ns)]
        if not values:
            continue
        if headers is None:
            headers = values
            continue
        rows.append(dict(zip(headers, values)))
    return rows


def bigairports_module_url() -> str:
    html = fetch(BIGAIRPORTS_URL).decode("utf-8", "replace")
    homepage = re.search(r'/_astro/Homepage\.[A-Za-z0-9_-]+\.js', html)
    if homepage:
        html += fetch(BIGAIRPORTS_URL.rstrip("/") + homepage.group(0)).decode("utf-8", "replace")
    match = re.search(r'/_astro/airports\.[A-Za-z0-9_-]+\.js', html)
    if match:
        return BIGAIRPORTS_URL.rstrip("/") + match.group(0)
    relative_match = re.search(r'\./(airports\.[A-Za-z0-9_-]+\.js)', html)
    if relative_match:
        return BIGAIRPORTS_URL.rstrip("/") + "/_astro/" + relative_match.group(1)
    raise RuntimeError("Could not find BigAirports airport data module")


def bigairports_rows() -> list[dict]:
    osascript = shutil.which("osascript")
    if not osascript:
        raise RuntimeError("BigAirports data extraction requires macOS osascript/JXA")

    source = fetch(bigairports_module_url()).decode("utf-8", "replace")
    source = re.sub(
        r"export\{YSe as A,XSe as M,ZSe as S\};?\s*$",
        "JSON.stringify(YSe);",
        source,
    )
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as temp:
        temp.write(source)
        temp_path = temp.name

    script = f"""
ObjC.import('Foundation');
const source = ObjC.unwrap($.NSString.stringWithContentsOfFileEncodingError('{temp_path}', $.NSUTF8StringEncoding, null));
console.log(eval(source));
"""
    try:
        result = subprocess.run(
            [osascript, "-l", "JavaScript", "-e", script],
            check=True,
            capture_output=True,
            text=True,
        )
    finally:
        Path(temp_path).unlink(missing_ok=True)

    output = result.stdout.strip() or result.stderr.strip()
    return json.loads(output)


def airport_entry(code: str, name: str, lat: float | str, lng: float | str) -> dict[str, str]:
    return {
        "code": str(code).strip(),
        "name": str(name).strip(),
        "lat": str(lat).strip(),
        "lng": str(lng).strip(),
    }


def add_ourairport(entries: dict[str, dict[str, str]], row: dict[str, str], code: str | None = None) -> None:
    selected_code = code or airport_code(row)
    if not selected_code:
        return
    entries.setdefault(
        selected_code,
        airport_entry(selected_code, row.get("name", ""), row.get("latitude_deg", ""), row.get("longitude_deg", "")),
    )


def write_airports(entries: dict[str, dict[str, str]]) -> None:
    with AIRPORTS_CSV.open("w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=["code", "name", "lat", "lng"])
        writer.writeheader()
        for code in sorted(entries):
            writer.writerow(entries[code])


def main() -> int:
    entries = {
        row["code"]: airport_entry(row["code"], row.get("name", ""), row.get("lat", ""), row.get("lng", ""))
        for row in read_csv(AIRPORTS_CSV)
        if row.get("code")
    }

    ourairports = load_ourairports()
    ourairports_index = index_ourairports(ourairports)

    ranked_faa_rows = [
        row for row in faa_rows()
        if (row.get("Rank") or "").isdigit() and not (row.get("Locid") or "").isdigit()
    ]
    for row in ranked_faa_rows[:500]:
        locid = (row.get("Locid") or "").strip()
        match = best_match(ourairports_index.get(locid, []), prefer_country="US")
        if match:
            add_ourairport(entries, match)
        else:
            print(f"Could not resolve FAA airport {locid}", file=sys.stderr)

    world = sorted(
        bigairports_rows(),
        key=lambda row: float(row.get("passengers") or 0),
        reverse=True,
    )[:500]
    for row in world:
        code = row.get("icao") or row.get("iata")
        if code:
            entries.setdefault(
                code,
                airport_entry(code, row.get("name", ""), row.get("lat", ""), row.get("lng", "")),
            )

    unresolved = []
    for code in route_stop_codes():
        if code in entries:
            continue
        match = best_match(ourairports_index.get(code, []))
        if match:
            add_ourairport(entries, match, code=code if code == match.get("iata_code") else None)
        else:
            unresolved.append(code)

    write_airports(entries)

    print(f"Wrote {len(entries)} airport code rows to {AIRPORTS_CSV}")
    if unresolved:
        print(f"Unresolved route stop code(s): {', '.join(sorted(unresolved))}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
