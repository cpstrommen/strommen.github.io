#!/usr/bin/env python3
"""Generate static driving and train GeoJSON for the travel map."""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
ROUTES_DIR = ROOT / "assets" / "routes"
DEFAULT_OSRM_URL = "https://router.project-osrm.org"
DEFAULT_PT_URL = "https://openstreetmap.tools/public_transport_geojson"


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as file:
        return [
            {key: (value or "").strip() for key, value in row.items()}
            for row in csv.DictReader(file)
            if any((value or "").strip() for value in row.values())
        ]


def write_geojson(path: Path, features: list[dict]) -> None:
    collection = {
        "type": "FeatureCollection",
        "features": features,
    }
    path.write_text(json.dumps(collection, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def load_airports(path: Path) -> dict[str, dict]:
    airports = {}
    for row in read_csv(path):
        code = row.get("code", "")
        try:
            lat = float(row.get("lat", ""))
            lng = float(row.get("lng", ""))
        except ValueError:
            raise ValueError(f"Invalid lat/lng for airport {code or row!r}") from None

        if not code:
            raise ValueError(f"Airport row is missing code: {row!r}")

        airports[code] = {
            "code": code,
            "name": row.get("name", ""),
            "lat": lat,
            "lng": lng,
        }
    return airports


def split_stops(value: str) -> list[str]:
    return [stop.strip() for stop in value.split("|") if stop.strip()]


def relation_ids(value: str) -> list[str]:
    normalized = value.replace(";", "|").replace("+", "|")
    return [part.strip() for part in normalized.split("|") if part.strip()]


def request_json(url: str, timeout: int, retries: int, pause: float) -> dict:
    last_error: Exception | None = None

    for attempt in range(1, retries + 1):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "strommen-travel-map/1.0"})
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return json.loads(response.read().decode("utf-8"))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as error:
            last_error = error
            if attempt < retries:
                time.sleep(pause)

    raise RuntimeError(f"Request failed after {retries} attempts: {url}\n{last_error}") from last_error


def osrm_route_url(base_url: str, origin: dict, destination: dict) -> str:
    coords = f"{origin['lng']},{origin['lat']};{destination['lng']},{destination['lat']}"
    query = urllib.parse.urlencode({
        "overview": "full",
        "geometries": "geojson",
        "steps": "false",
        "alternatives": "false",
    })
    return f"{base_url.rstrip('/')}/route/v1/driving/{coords}?{query}"


def generate_driving_features(
    airports: dict[str, dict],
    trips: list[dict[str, str]],
    osrm_base_url: str,
    timeout: int,
    retries: int,
    pause: float,
) -> list[dict]:
    features = []

    for trip in trips:
        trip_id = trip.get("trip_id", "")
        stops = split_stops(trip.get("stops", ""))

        if len(stops) < 2:
            print(f"Skipping driving trip with fewer than two stops: {trip!r}", file=sys.stderr)
            continue

        missing = [stop for stop in stops if stop not in airports]
        if missing:
            raise ValueError(f"Driving trip {trip_id or trip!r} has unknown airport code(s): {', '.join(missing)}")

        for index, (from_code, to_code) in enumerate(zip(stops, stops[1:]), start=1):
            data = request_json(
                osrm_route_url(osrm_base_url, airports[from_code], airports[to_code]),
                timeout,
                retries,
                pause,
            )
            routes = data.get("routes") or []
            if not routes:
                raise RuntimeError(f"OSRM returned no route for driving leg {trip_id}:{index} {from_code}->{to_code}")

            route = routes[0]
            features.append({
                "type": "Feature",
                "geometry": route["geometry"],
                "properties": {
                    "mode": "driving",
                    "trip_id": trip_id,
                    "route_id": f"{trip_id}-{index}" if trip_id else f"{from_code}-{to_code}",
                    "leg_index": index,
                    "from": from_code,
                    "to": to_code,
                    "date": trip.get("date", ""),
                    "notes": trip.get("notes", ""),
                    "distance_m": route.get("distance"),
                    "duration_s": route.get("duration"),
                    "source": "OSRM",
                },
            })
            print(f"Driving {trip_id or '(no trip_id)'} leg {index}: {from_code} -> {to_code}")
            if pause:
                time.sleep(pause)

    return features


def line_strings_from_geojson(collection: dict) -> list[list]:
    line_strings = []

    for feature in collection.get("features", []):
        geometry = feature.get("geometry") or {}
        geometry_type = geometry.get("type")
        coordinates = geometry.get("coordinates") or []

        if geometry_type == "LineString":
            line_strings.append(coordinates)
        elif geometry_type == "MultiLineString":
            line_strings.extend(coordinates)

    return line_strings


def train_route_url(base_url: str, relation_id: str) -> str:
    return f"{base_url.rstrip('/')}/api/route/{urllib.parse.quote(relation_id)}"


def generate_train_features(
    trips: list[dict[str, str]],
    public_transport_base_url: str,
    timeout: int,
    retries: int,
    pause: float,
) -> list[dict]:
    features = []

    for trip in trips:
        trip_id = trip.get("trip_id", "")
        stops = split_stops(trip.get("stops", ""))
        ids = relation_ids(trip.get("route_id", ""))

        if len(stops) < 2:
            print(f"Skipping train trip with fewer than two stops: {trip!r}", file=sys.stderr)
            continue

        if not ids:
            raise ValueError(f"Train trip {trip_id or trip!r} is missing route_id relation ID(s)")

        line_strings = []
        relation_names = []
        for relation_id in ids:
            data = request_json(
                train_route_url(public_transport_base_url, relation_id),
                timeout,
                retries,
                pause,
            )
            line_strings.extend(line_strings_from_geojson(data.get("geojson", {})))
            relation_names.append(data.get("name") or relation_id)
            print(f"Train {trip_id or '(no trip_id)'} relation {relation_id}: {data.get('name') or 'unnamed'}")
            if pause:
                time.sleep(pause)

        if not line_strings:
            raise RuntimeError(f"No rail LineString geometry found for train trip {trip_id or trip!r}")

        features.append({
            "type": "Feature",
            "geometry": {
                "type": "MultiLineString",
                "coordinates": line_strings,
            },
            "properties": {
                "mode": "train",
                "trip_id": trip_id,
                "route_id": trip.get("route_id", "") or trip_id,
                "from": stops[0],
                "to": stops[-1],
                "date": trip.get("date", ""),
                "notes": trip.get("notes", ""),
                "relation_names": " | ".join(relation_names),
                "source": "OSM public_transport_geojson",
            },
        })

    return features


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Generate assets/routes/*-routes.geojson from travel route CSV files.",
    )
    parser.add_argument("--routes-dir", type=Path, default=ROUTES_DIR)
    parser.add_argument("--mode", choices=["all", "driving", "train"], default="all")
    parser.add_argument("--osrm-base-url", default=DEFAULT_OSRM_URL)
    parser.add_argument("--public-transport-base-url", default=DEFAULT_PT_URL)
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--retries", type=int, default=3)
    parser.add_argument("--pause", type=float, default=0.25)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    routes_dir = args.routes_dir
    airports = load_airports(routes_dir / "airports.csv")

    if args.mode in {"all", "driving"}:
        driving_features = generate_driving_features(
            airports,
            read_csv(routes_dir / "driving-trips.csv"),
            args.osrm_base_url,
            args.timeout,
            args.retries,
            args.pause,
        )
        write_geojson(routes_dir / "driving-routes.geojson", driving_features)
        print(f"Wrote {len(driving_features)} driving feature(s)")

    if args.mode in {"all", "train"}:
        train_features = generate_train_features(
            read_csv(routes_dir / "train-trips.csv"),
            args.public_transport_base_url,
            args.timeout,
            args.retries,
            args.pause,
        )
        write_geojson(routes_dir / "train-routes.geojson", train_features)
        print(f"Wrote {len(train_features)} train feature(s)")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
