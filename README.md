# strommen.ch

This repository contains the source for my personal website, [strommen.ch](https://strommen.ch). It is a static site hosted with GitHub Pages and includes my portfolio, writing, project archives, and travel map.

## Site structure

- `index.html` and `about.html` contain the main portfolio pages.
- `map.html` renders a privacy-reduced summary of flight, driving, and train routes from the CSV and GeoJSON files in `assets/routes/`.
- `articles/` contains published writing and supporting documents.
- `work/` contains older project material and browser-based project archives.
- `scripts/` contains local utilities for updating travel-map data and previewing the site.

Route maintenance is documented in [`assets/routes/README.md`](assets/routes/README.md).

## Local preview

From the repository root, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000/>. A local server is required for pages that load CSV or GeoJSON data with `fetch()`.

## Repository notes

This is a personal website repository rather than a reusable template or community-maintained project, so issues and pull requests are not actively solicited. Third-party libraries, fonts, and geographic data remain subject to their respective licenses and attribution terms. Unless otherwise noted, the original site content and source are not offered under an open-source license.
