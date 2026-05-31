# Travel Route Data

The travel map on `map.html` loads the CSV and GeoJSON files in this directory.

## Quick Workflow

1. Add or edit route rows in the CSV files:

```text
flights.csv
driving-trips.csv
train-trips.csv
```

2. If you used a new airport code, make sure it exists in `airports.csv`. If it does not, run:

```sh
python3 scripts/update-airports.py
```

3. Regenerate the map geometry after editing `driving-trips.csv` or `train-trips.csv`:

```sh
python3 scripts/generate-route-geojson.py
```

4. Preview the map locally:

```sh
python3 scripts/preview-map.py
```

5. Open `http://localhost:8000/map.html` in your browser or VSCode Simple Browser.

6. Commit and push the changed CSV/GeoJSON files.

## File Guide

- `airports.csv`: airport lookup table. Use ICAO codes when possible, for example `KMSP`, `EGLL`, `RJTT`.
- `flights.csv`: one flight leg per row. Add `date,type,origin,destination,notes`.
- `driving-trips.csv`: one driving trip per row. Add ordered stops like `KMSP|KORD|KDTW`.
- `train-trips.csv`: one train trip per row. Add ordered stops and an OSM relation ID in `route_id`.
- `driving-routes.geojson`: generated road-following route geometry.
- `train-routes.geojson`: generated rail-following route geometry.

Do not hand-edit `driving-routes.geojson` or `train-routes.geojson` unless you intentionally want custom geometry. Normally, edit the CSVs and rerun the generator.

## Flights

Add one row per flight leg:

```csv
date,type,origin,destination,notes
2026-06-01,commercial,KMSP,KORD,United
2026-06-02,pic,KOEO,KEAU,N5601A
```

Valid `type` values:

- `pic`: general aviation / personal flying
- `commercial`: airline flights

After editing only `flights.csv`, you do not need to regenerate GeoJSON. Just preview the map.

## Driving Trips

Add one row per trip:

```csv
trip_id,date,stops,notes
18,2026-06-01,KMSP|KORD|KDTW,Road trip
```

Rules:

- `trip_id` only needs to be unique within `driving-trips.csv`.
- `stops` are airport codes separated by `|`.
- The route is generated between each adjacent stop in order.
- The generator uses OSRM to create shortest road-following geometry.

After editing, run:

```sh
python3 scripts/generate-route-geojson.py --mode driving
```

## Train Trips

Add one row per trip:

```csv
trip_id,date,stops,notes,route_id
2,2026-06-01,EGPE|EGLC,Caledonian Sleeper,6393945
```

Rules:

- `trip_id` only needs to be unique within `train-trips.csv`.
- Train trip IDs are separate from driving trip IDs, so both files can have `trip_id` `1`.
- `stops` are airport codes separated by `|`.
- `route_id` is not your personal trip ID. It is the OpenStreetMap public transport route relation ID.
- Use multiple OSM relation IDs separated by `|` if one trip needs multiple rail relations.

After editing, run:

```sh
python3 scripts/generate-route-geojson.py --mode train
```

## Airport Codes

If the generator says an airport code is unknown, first try:

```sh
python3 scripts/update-airports.py
```

That script preserves existing rows, adds top U.S. airports from FAA data, adds top global airports from BigAirports, and uses OurAirports for coordinates.

If a code is still missing, add it manually to `airports.csv`:

```csv
code,name,lat,lng
KMSP,Minneapolis-Saint Paul International Airport,44.882,-93.2218
```

## Unvisited Top Airports

These lists treat an airport as visited if its code appears in `flights.csv`, `driving-trips.csv`, or `train-trips.csv`. Rankings are ordered largest to smallest by passenger traffic. The U.S. list uses FAA CY2024 enplanements; the global list uses BigAirports passenger rankings.

### Top 50 U.S. Airports Not Yet Visited

Underlined airports are Delta, United, or American hubs where a future connection is especially plausible.

| U.S. Rank | Code | Airport | CY2024 enplanements |
| --- | --- | --- | ---: |
| 3 | <u>KDEN</u> | <u>Denver International</u> | 40,012,895 |
| 7 | <u>KCLT</u> | <u>Charlotte/Douglas International</u> | 28,523,822 |
| 8 | KLAS | Harry Reid International | 28,244,966 |
| 9 | KMCO | Orlando International | 27,859,783 |
| 10 | <u>KMIA</u> | <u>Miami International</u> | 26,588,002 |
| 11 | <u>KPHX</u> | <u>Phoenix Sky Harbor International</u> | 25,595,723 |
| 15 | <u>KIAH</u> | <u>George Bush Intcntl/Houston</u> | 23,349,157 |
| 22 | <u>KSLC</u> | <u>Salt Lake City International</u> | 13,543,570 |
| 23 | KBWI | Baltimore/Washington International Thurgood Marshall | 13,221,461 |
| 30 | PHNL | Daniel K Inouye International | 10,449,022 |
| 31 | KMDW | Chicago Midway International | 10,360,093 |
| 32 | KDAL | Dallas Love Field | 8,654,991 |
| 33 | KPDX | Portland International | 8,639,088 |
| 36 | KHOU | William P Hobby | 7,116,967 |
| 37 | KSMF | Sacramento International | 6,679,426 |
| 38 | KMSY | Louis Armstrong New Orleans International | 6,537,092 |
| 40 | KMCI | Kansas City International | 5,915,078 |
| 41 | KSJC | Norman Y Mineta San Jose International | 5,822,019 |
| 44 | KSNA | John Wayne/Orange County | 5,370,273 |
| 45 | KOAK | Oakland San Francisco Bay | 5,292,736 |
| 47 | KCLE | Cleveland-Hopkins International | 4,950,345 |
| 48 | KPIT | Pittsburgh International | 4,862,376 |
| 50 | KCMH | John Glenn Columbus International | 4,387,395 |

### Top 50 Global Airports Not Yet Visited

| Global Rank | Code | Airport | Country | Passengers |
| --- | --- | --- | --- | ---: |
| 2 | OMDB | Dubai International Airport | AE | 92.3M |
| 6 | <u>KDEN</u> | <u>Denver International Airport</u> | US | 82.4M |
| 7 | LTFM | Istanbul Airport | TR | 80.1M |
| 9 | VIDP | Indira Gandhi International Airport | IN | 77.8M |
| 10 | ZSPD | Shanghai Pudong International Airport | CN | 76.8M |
| 12 | ZGGG | Guangzhou Baiyun International Airport | CN | 76.4M |
| 14 | LFPG | Charles de Gaulle International Airport | FR | 70.3M |
| 16 | ZBAA | Beijing Capital International Airport | CN | 67.4M |
| 18 | LEMD | Adolfo Suarez Madrid-Barajas Airport | ES | 66.2M |
| 20 | VTBS | Suvarnabhumi Airport | TH | 62.2M |
| 21 | EDDF | Frankfurt Airport | DE | 61.6M |
| 22 | ZGSZ | Shenzhen Bao'an International Airport | CN | 61.5M |
| 23 | <u>KCLT</u> | <u>Charlotte Douglas International Airport</u> | US | 58.8M |
| 24 | <u>KLAS</u> | <u>Harry Reid International Airport</u> | US | 58.4M |
| 25 | <u>KMCO</u> | <u>Orlando International Airport</u> | US | 57.2M |
| 26 | WMKK | Kuala Lumpur International Airport | MY | 57.1M |
| 27 | <u>KMIA</u> | <u>Miami International Airport</u> | US | 56.0M |
| 28 | VABB | Chhatrapati Shivaji International Airport | IN | 55.1M |
| 29 | LEBL | Josep Tarradellas Barcelona-El Prat Airport | ES | 55.0M |
| 30 | ZUTF | Chengdu Tianfu International Airport | CN | 54.9M |
| 31 | VHHH | Hong Kong International Airport | HK | 53.1M |
| 33 | OTHH | Hamad International Airport | QA | 52.5M |
| 34 | <u>KPHX</u> | <u>Phoenix Sky Harbor International Airport</u> | US | 52.3M |
| 36 | RPLL | Ninoy Aquino International Airport | PH | 50.1M |
| 37 | ZBAD | Beijing Daxing International Airport | CN | 49.4M |
| 38 | LIRF | Rome-Fiumicino Leonardo da Vinci International Airport | IT | 49.2M |
| 39 | RCTP | Taiwan Taoyuan International Airport | TW | 49.2M |
| 40 | OEJN | King Abdulaziz International Airport | SA | 49.1M |
| 42 | ZUCK | Chongqing Jiangbei International Airport | CN | 48.7M |
| 43 | <u>KIAH</u> | <u>George Bush Intercontinental Houston Airport</u> | US | 48.5M |
| 44 | ZSHC | Hangzhou Xiaoshan International Airport | CN | 48.1M |
| 45 | ZSSS | Shanghai Hongqiao International Airport | CN | 48.0M |
| 46 | ZPPP | Kunming Changshui International Airport | CN | 47.0M |
| 47 | ZLXY | Xi'an Xianyang International Airport | CN | 47.0M |
| 48 | CYYZ | Toronto Lester B. Pearson International Airport | CA | 46.8M |
| 49 | SKBO | El Dorado International Airport | CO | 45.8M |
| 50 | MMMX | Benito Juarez International Airport | MX | 45.4M |

## Preview Notes

Do not preview by opening `map.html` directly as a file. The map uses browser `fetch()` to load CSV and GeoJSON, and local file previews often block those requests.

Use:

```sh
python3 scripts/preview-map.py
```

Then open the printed localhost URL.
