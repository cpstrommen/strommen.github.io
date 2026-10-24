# Public Travel Route Data

The travel map loads the CSV and GeoJSON files in this directory. These are intentionally public, privacy-reduced datasets: they describe unique airport or city-level routes, not individual trips.

Do not add dates, timestamps, trip notes, vehicle or aircraft registrations, recurrence counts, home addresses, accommodation locations, or other precise personal locations to these files.

## Update Workflow

1. Add a unique route to the appropriate CSV file.
2. Confirm every endpoint exists in `airports.csv`.
3. After changing driving or train routes, regenerate the GeoJSON:

```sh
python3 scripts/generate-route-geojson.py
```

4. Preview the site locally:

```sh
python3 scripts/preview-map.py
```

5. Open `http://localhost:8000/map.html` and check the route, markers, popup, and browser console.
6. Commit the sanitized CSV and generated GeoJSON together.

## Flights

`flights.csv` contains one unique, direction-independent route per flight category:

```csv
type,origin,destination
commercial,KMSP,KORD
pic,KEAU,KOEO
```

Valid `type` values are `commercial` and `pic`. The latter is displayed as general aviation. A route that has been traveled more than once still appears only once.

Flight routes use great-circle geometry generated in the browser, so editing only `flights.csv` does not require running the GeoJSON generator.

## Driving

`driving-trips.csv` contains one unique, direction-independent road segment per row:

```csv
stops
KMSP|KORD
```

Use exactly two location codes separated by `|`. The generator uses OSRM to create road-following geometry and deduplicates reversed or repeated endpoint pairs.

To regenerate only driving routes:

```sh
python3 scripts/generate-route-geojson.py --mode driving
```

## Trains

`train-trips.csv` contains public endpoints and the OpenStreetMap relation ID needed to rebuild each rail route:

```csv
stops,route_id
EGPE|EGLC,6393945
```

Use two location codes separated by `|`. Multiple OpenStreetMap relation IDs may be separated by `|` when one route needs more than one relation.

To regenerate only train routes:

```sh
python3 scripts/generate-route-geojson.py --mode train
```

## Location Codes

`airports.csv` is the public coordinate lookup table:

```csv
code,name,lat,lng
KMSP,Minneapolis-Saint Paul International Airport,44.882,-93.2218
```

ICAO codes are preferred for airports. Descriptive codes may be used for public city centers. Do not add private addresses or private lodging coordinates.

If an airport code is missing, run:

```sh
python3 scripts/update-airports.py
```

That maintenance script preserves existing rows and imports public airport data. Review its changes before committing.

## Generated Files

- `driving-routes.geojson` contains one road geometry per public endpoint pair.
- `train-routes.geojson` contains one rail geometry per public train route.

Generated feature properties are deliberately minimal. They must not contain personal trip IDs, dates, notes, registrations, frequency counts, or durations.

Do not preview `map.html` as a `file://` URL. Browser security rules commonly block its `fetch()` requests; use the local preview server instead.
