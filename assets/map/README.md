# Local basemap

`ne_50m_countries.geojson` supplies the land and country outlines for the travel
map. Keeping this file in the repository avoids API keys and hosted tile-service
dependencies at runtime.

Source: Natural Earth, `ne_50m_admin_0_countries.geojson`

- Project: <https://www.naturalearthdata.com/>
- Repository: <https://github.com/nvkelso/natural-earth-vector>
- Source revision: `ca96624a56bd078437bca8184e78163e5039ad19`
- License: Public domain

The local copy removes unused feature properties but preserves each feature's
geometry and country name.
