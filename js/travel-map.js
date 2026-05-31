(function () {
  const DATA_FILES = {
    airports: 'assets/routes/airports.csv',
    flights: 'assets/routes/flights.csv',
    drivingTrips: 'assets/routes/driving-trips.csv',
    trainTrips: 'assets/routes/train-trips.csv',
    drivingRoutes: 'assets/routes/driving-routes.geojson',
    trainRoutes: 'assets/routes/train-routes.geojson'
  };

  const COLORS = {
    pic: '#00bcd4',
    commercial: '#ff9800',
    driving: '#4caf50',
    train: '#8e7cc3'
  };

  const WORLD_OFFSETS = [-360, 0, 360];

  const map = L.map('flight-map', {
    scrollWheelZoom: true,
    worldCopyJump: true
  }).setView([30, 0], 2);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }).addTo(map);

  const allBounds = L.latLngBounds();

  function parseCsv(text) {
    const rows = [];
    let row = [];
    let field = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const next = text[i + 1];

      if (char === '"') {
        if (inQuotes && next === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(field);
        field = '';
      } else if ((char === '\n' || char === '\r') && !inQuotes) {
        if (char === '\r' && next === '\n') i++;
        row.push(field);
        if (row.some(value => value.trim() !== '')) rows.push(row);
        row = [];
        field = '';
      } else {
        field += char;
      }
    }

    row.push(field);
    if (row.some(value => value.trim() !== '')) rows.push(row);

    if (!rows.length) return [];

    const headers = rows[0].map(header => header.trim());

    return rows.slice(1).map(values => {
      const record = {};
      headers.forEach((header, index) => {
        record[header] = (values[index] || '').trim();
      });
      return record;
    });
  }

  async function loadCsv(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return parseCsv(await response.text());
  }

  async function loadJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: ${response.status}`);
    }
    return response.json();
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function toRad(deg) {
    return deg * Math.PI / 180;
  }

  function toDeg(rad) {
    return rad * 180 / Math.PI;
  }

  function normalizeLng(lng) {
    while (lng > 180) lng -= 360;
    while (lng < -180) lng += 360;
    return lng;
  }

  function shiftLatLng(latlng, lngOffset) {
    return L.latLng(latlng.lat, latlng.lng + lngOffset);
  }

  function shiftSegment(segment, lngOffset) {
    return segment.map(point => L.latLng(point.lat, point.lng + lngOffset));
  }

  function greatCirclePoints(from, to, steps = 96) {
    const lat1 = toRad(from.lat);
    const lon1 = toRad(from.lng);
    const lat2 = toRad(to.lat);
    const lon2 = toRad(to.lng);

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    const d = 2 * Math.asin(Math.sqrt(a));

    if (!d || Number.isNaN(d)) {
      return [
        { lat: from.lat, lng: from.lng },
        { lat: to.lat, lng: to.lng }
      ];
    }

    const points = [];

    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);

      const x =
        A * Math.cos(lat1) * Math.cos(lon1) +
        B * Math.cos(lat2) * Math.cos(lon2);
      const y =
        A * Math.cos(lat1) * Math.sin(lon1) +
        B * Math.cos(lat2) * Math.sin(lon2);
      const z =
        A * Math.sin(lat1) +
        B * Math.sin(lat2);

      points.push({
        lat: toDeg(Math.atan2(z, Math.sqrt(x * x + y * y))),
        lng: toDeg(Math.atan2(y, x))
      });
    }

    return points;
  }

  function unwrapLongitudes(points) {
    if (!points.length) return points;

    const unwrapped = [{ ...points[0] }];

    for (let i = 1; i < points.length; i++) {
      let lng = points[i].lng;
      const prevLng = unwrapped[i - 1].lng;

      while (lng - prevLng > 180) lng -= 360;
      while (lng - prevLng < -180) lng += 360;

      unwrapped.push({
        lat: points[i].lat,
        lng
      });
    }

    return unwrapped;
  }

  function splitAtDateLine(points) {
    if (points.length < 2) return [points];

    const segments = [];
    let current = [points[0]];

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const prevNorm = normalizeLng(prev.lng);
      const currNorm = normalizeLng(curr.lng);

      if (Math.abs(currNorm - prevNorm) > 180 - 1e-6) {
        segments.push(current);
        current = [curr];
      } else {
        current.push(curr);
      }
    }

    if (current.length) segments.push(current);

    return segments.map(segment =>
      segment.map(point => L.latLng(point.lat, normalizeLng(point.lng)))
    );
  }

  function buildGreatCircleSegments(from, to, steps = 96) {
    return splitAtDateLine(unwrapLongitudes(greatCirclePoints(from, to, steps)));
  }

  function airportMap(rows) {
    const airports = new Map();

    rows.forEach(row => {
      const code = row.code;
      const lat = Number(row.lat);
      const lng = Number(row.lng);

      if (!code || Number.isNaN(lat) || Number.isNaN(lng)) {
        console.warn('Skipping invalid airport row', row);
        return;
      }

      airports.set(code, {
        code,
        name: row.name || '',
        lat,
        lng
      });
    });

    return airports;
  }

  function airportLatLng(airport) {
    return L.latLng(airport.lat, airport.lng);
  }

  function markerOptions(color) {
    return {
      radius: 3,
      color,
      weight: 1,
      fillColor: color,
      fillOpacity: 0.9
    };
  }

  function addAirportMarker(airport, color, popupHtml) {
    WORLD_OFFSETS.forEach(offset => {
      L.circleMarker(shiftLatLng(airportLatLng(airport), offset), markerOptions(color))
        .addTo(map)
        .bindPopup(popupHtml);
    });
    allBounds.extend(airportLatLng(airport));
  }

  function renderFlights(flights, airports) {
    flights.forEach(flight => {
      const origin = airports.get(flight.origin);
      const destination = airports.get(flight.destination);

      if (!origin || !destination) {
        console.warn('Skipping flight with unknown airport code', flight);
        return;
      }

      const type = flight.type === 'pic' ? 'pic' : 'commercial';
      const color = COLORS[type];
      const from = airportLatLng(origin);
      const to = airportLatLng(destination);
      const arcSegments = buildGreatCircleSegments(from, to, 128);
      const popupHtml = [
        `<strong>${escapeHtml(origin.code)} &rarr; ${escapeHtml(destination.code)}</strong>`,
        `<small>${escapeHtml(origin.name)}${origin.name && destination.name ? ' &ndash; ' : ''}${escapeHtml(destination.name)}</small>`,
        flight.date ? `<small>${escapeHtml(flight.date)}</small>` : '',
        `<small>Type: ${type === 'pic' ? 'PIC / personal' : 'Commercial'}</small>`,
        flight.notes ? escapeHtml(flight.notes) : ''
      ].filter(Boolean).join('<br/>');

      WORLD_OFFSETS.forEach(offset => {
        arcSegments.forEach(segment => {
          L.polyline(shiftSegment(segment, offset), {
            color,
            weight: 2.5,
            opacity: 0.8,
            noClip: true
          }).addTo(map).bindPopup(popupHtml);
        });
      });

      addAirportMarker(origin, color, popupHtml);
      addAirportMarker(destination, color, popupHtml);
    });
  }

  function routeLineStrings(geometry) {
    if (!geometry) return [];

    if (geometry.type === 'LineString') {
      return [geometry.coordinates];
    }

    if (geometry.type === 'MultiLineString') {
      return geometry.coordinates;
    }

    if (geometry.type === 'GeometryCollection') {
      return geometry.geometries.flatMap(routeLineStrings);
    }

    return [];
  }

  function lineStringToLatLngs(lineString) {
    return lineString.map(([lng, lat]) => L.latLng(lat, lng));
  }

  function extendRouteBounds(lineStrings) {
    lineStrings.forEach(lineString => {
      lineString.forEach(([lng, lat]) => {
        allBounds.extend(L.latLng(lat, lng));
      });
    });
  }

  function addRouteGeometry(feature, color, popupHtml) {
    const lineStrings = routeLineStrings(feature.geometry);

    if (!lineStrings.length) {
      console.warn('Skipping route feature without line geometry', feature);
      return false;
    }

    lineStrings.forEach(lineString => {
      const latLngs = lineStringToLatLngs(lineString);
      WORLD_OFFSETS.forEach(offset => {
        L.polyline(shiftSegment(latLngs, offset), {
          color,
          weight: 3.5,
          opacity: 0.85,
          noClip: true
        }).addTo(map).bindPopup(popupHtml);
      });
    });

    extendRouteBounds(lineStrings);
    return true;
  }

  function featureKey(feature) {
    const props = feature.properties || {};
    const from = props.from || props.origin;
    const to = props.to || props.destination || props.dest;
    const keys = [];

    if (props.route_id) keys.push(`route:${props.route_id}`);
    if (props.trip_id && props.leg_index) keys.push(`trip-leg:${props.trip_id}:${props.leg_index}`);
    if (props.trip_id && from && to) keys.push(`trip-pair:${props.trip_id}:${from}:${to}`);
    if (from && to) keys.push(`pair:${from}:${to}`);

    return keys;
  }

  function indexRouteFeatures(geojson) {
    const index = new Map();

    (geojson.features || []).forEach(feature => {
      featureKey(feature).forEach(key => {
        index.set(key, feature);
      });
    });

    return index;
  }

  function routeStops(trip) {
    return (trip.stops || '')
      .split('|')
      .map(stop => stop.trim())
      .filter(Boolean);
  }

  function validTripAirports(trip, airports) {
    const stops = routeStops(trip);
    const missing = stops.filter(stop => !airports.has(stop));

    if (stops.length < 2) {
      console.warn('Skipping trip with fewer than two stops', trip);
      return null;
    }

    if (missing.length) {
      console.warn('Skipping trip with unknown airport code(s)', missing, trip);
      return null;
    }

    return stops;
  }

  function routePopupHtml(label, trip, stops, from, to) {
    return [
      `<strong>${escapeHtml(label)}: ${escapeHtml(from || stops[0])} &rarr; ${escapeHtml(to || stops[stops.length - 1])}</strong>`,
      `<small>${stops.map(escapeHtml).join(' &rarr; ')}</small>`,
      trip.date ? `<small>${escapeHtml(trip.date)}</small>` : '',
      trip.notes ? escapeHtml(trip.notes) : ''
    ].filter(Boolean).join('<br/>');
  }

  function findDrivingFeature(routeIndex, trip, from, to, legIndex) {
    const candidates = [
      `trip-leg:${trip.trip_id}:${legIndex}`,
      `trip-pair:${trip.trip_id}:${from}:${to}`,
      `route:${trip.trip_id}:${legIndex}`,
      `route:${trip.trip_id}-${legIndex}`,
      `pair:${from}:${to}`
    ];

    for (const key of candidates) {
      if (routeIndex.has(key)) return routeIndex.get(key);
    }

    return null;
  }

  function renderDrivingTrips(trips, airports, routes) {
    const routeIndex = indexRouteFeatures(routes);

    trips.forEach(trip => {
      if (!trip.trip_id && !trip.stops) return;

      const stops = validTripAirports(trip, airports);
      if (!stops) return;

      for (let i = 0; i < stops.length - 1; i++) {
        const from = stops[i];
        const to = stops[i + 1];
        const feature = findDrivingFeature(routeIndex, trip, from, to, i + 1);

        if (!feature) {
          console.warn('Skipping driving leg with missing route geometry', {
            trip_id: trip.trip_id,
            leg_index: i + 1,
            from,
            to
          });
          continue;
        }

        const popupHtml = routePopupHtml('Driving', trip, stops, from, to);
        if (addRouteGeometry(feature, COLORS.driving, popupHtml)) {
          addAirportMarker(airports.get(from), COLORS.driving, popupHtml);
          addAirportMarker(airports.get(to), COLORS.driving, popupHtml);
        }
      }
    });
  }

  function renderTrainTrips(trips, airports, routes) {
    const routeIndex = indexRouteFeatures(routes);

    trips.forEach(trip => {
      if (!trip.route_id && !trip.stops) return;

      const stops = validTripAirports(trip, airports);
      if (!stops) return;

      const routeId = trip.route_id;
      if (!routeId) {
        console.warn('Skipping train trip with missing route_id relation ID', {
          trip_id: trip.trip_id
        });
        return;
      }

      const feature = routeIndex.get(`route:${routeId}`);

      if (!feature) {
        console.warn('Skipping train trip with missing route geometry', {
          trip_id: trip.trip_id,
          route_id: routeId
        });
        return;
      }

      const popupHtml = routePopupHtml('Train', trip, stops);
      if (addRouteGeometry(feature, COLORS.train, popupHtml)) {
        stops.forEach(stop => addAirportMarker(airports.get(stop), COLORS.train, popupHtml));
      }
    });
  }

  function fitMapToRenderedData() {
    if (allBounds.isValid()) {
      map.fitBounds(allBounds, { padding: [40, 40] });
    }
  }

  async function initTravelMap() {
    try {
      const [
        airportRows,
        flights,
        drivingTrips,
        trainTrips,
        drivingRoutes,
        trainRoutes
      ] = await Promise.all([
        loadCsv(DATA_FILES.airports),
        loadCsv(DATA_FILES.flights),
        loadCsv(DATA_FILES.drivingTrips),
        loadCsv(DATA_FILES.trainTrips),
        loadJson(DATA_FILES.drivingRoutes),
        loadJson(DATA_FILES.trainRoutes)
      ]);

      const airports = airportMap(airportRows);

      renderFlights(flights, airports);
      renderDrivingTrips(drivingTrips, airports, drivingRoutes);
      renderTrainTrips(trainTrips, airports, trainRoutes);
      fitMapToRenderedData();
    } catch (error) {
      console.error('Unable to initialize travel map', error);
    }
  }

  initTravelMap();
})();
