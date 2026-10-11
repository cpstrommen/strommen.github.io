# Local basemap

`ne_50m_countries.geojson` supplies the land and country outlines for the travel
map. Keeping this file in the repository avoids API keys and hosted tile-service
dependencies at runtime.

`ne_50m_us_state_borders.geojson` supplies dotted state and province boundary
lines filtered to the United States.

`ne_50m_lakes.geojson` supplies major lakes worldwide. Lakes use the map's ocean
color and a subtle shoreline so international and state borders meet the water
cleanly.

Sources: Natural Earth, `ne_50m_admin_0_countries.geojson` and
`ne_50m_admin_1_states_provinces_lines.geojson`, plus `ne_50m_lakes.geojson`

- Project: <https://www.naturalearthdata.com/>
- Repository: <https://github.com/nvkelso/natural-earth-vector>
- Source revision: `ca96624a56bd078437bca8184e78163e5039ad19`
- License: Public domain

The local copies remove unused feature properties. The state-border file also
removes every feature outside the United States.
