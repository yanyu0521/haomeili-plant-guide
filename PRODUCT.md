# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Visitors at the Haomeili coastal forest using a phone on site. They need to find plants along the reference trail map and learn about them while walking.

## Product Purpose

Help on-site visitors recognize plants in the Haomeili coastal shelter forest through a map-linked plant guide, spoken narration, and a coastal learning game. Success means visitors can find a plant, hear or read a concise introduction, and continue exploring.

## Positioning

The guide connects 15 plant entries to positions on the Haomeili 1920 shelter-forest reference map, with browser speech narration and a linked coastal game as extensions of the same field visit.

## Operating Context

Visitors use the website on a phone while exploring the forest and its paths. The map is a reference image with illustrated locations, rather than a GPS or surveyed coordinate map.

## Capabilities and Constraints

- The site is a static Astro website with home, plant directory, plant detail, and map pages.
- Preserve the existing 15 plant records, map search and family filter, plant-marker linking, browser speech-synthesis guide, external coastal game link, and source credits.
- Let visitors switch the home feature rail, plant directory, and plant detail media between generated botanical illustrations and locally hosted CC0 photo references. Preserve credits and observed photo locations when the audio guide changes the active detail plant.
- Map locations are approximate positions on the reference image, not precise latitude and longitude.
- Speech output depends on browser and device voice availability and must remain user initiated.
- The game is hosted separately at `https://haomeili-game.angela950730.workers.dev/`.
- The site is deployed under the `/haomeili-plant-guide/` base path.

## Brand Commitments

The user requested a Netflix-inspired UI across the site. Treat this as a reference for immersive, high-contrast content discovery and mobile browsing rhythm; do not use Netflix branding or assets.

## Evidence on Hand

- Plant records and source information: `src/data/plants.json`.
- Illustrated plant assets: `public/plants/*.svg`.
- Reference map: `public/images/forest-map.svg`.
- Guide photographs are CC0 reference photos from documented Taiwan observations. Their captions identify their photographers, locations, and exceptions. They do not imply a photograph was taken at a Haomeili map point.
- AI-generated botanical plates aid recognition, preserve scientific uncertainty, and are labeled as illustrations.

## Product Principles

- Make plant discovery easy during an on-site visit.
- Keep map labels, source notes, and location uncertainty clear.
- Keep narration optional and provide the same plant information as readable text.
- Let the external game extend the visit without obscuring the plant guide.
