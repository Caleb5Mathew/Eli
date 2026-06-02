# a poem for mello

A poem about the gift of stormy clouds — *after 1 Kings 19*. **For mello.**

A single long poem presented as an eleven-movement journey that moves from
**storm-blue to dawn-gold** as you advance. Swipe (touch), drag (mouse),
scroll, use the arrow keys, or tap the dots to move between pages. Scripture
from 1 Kings 19 is set apart in warm amber — light breaking through the cloud.

## Run it locally

It's a static site — no build step. Serve the folder with any static server:

```bash
python -m http.server 8000
# or
npx serve .
```

then open <http://localhost:8000>. (Open via a server, not `file://`, so
relative asset paths resolve correctly.)

## Controls

| Action | How |
| --- | --- |
| Next / previous | swipe · drag · scroll · ◀ ▶ arrows · `←` `→` keys |
| Jump to a page | tap a dot |
| First / last | `Home` / `End` |

Honors `prefers-reduced-motion`: animations and smooth-scrolling calm down
when the system asks for less motion.

## Structure

```
index.html      slide DOM, scripture blockquotes, inline SVG overlays
css/styles.css  storm→dawn palette ramp, scroll-snap, type, effects
js/app.js       active-slide detection, keyboard / drag / wheel nav
assets/img/     optional painterly backdrops (the site is complete without them)
```

The atmosphere is crafted in CSS + SVG, so the experience is whole on its own;
any backdrop imagery in `assets/img/` is layered on as enhancement.
