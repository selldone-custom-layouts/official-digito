# Tario's lifestyle photos

The home page (design A) has eleven photo slots. Each photo is made from a prompt in
[`kalio-design/tario-options/image-prompts-A.md`](../../../kalio-design/tario-options/image-prompts-A.md)
and saved here under exactly this name:

| File | Size | Where |
| --- | --- | --- |
| `tario-hero-1-weekly.jpg` | 1600 × 960 | Hero, slide 1 (deals) |
| `tario-hero-2-new.jpg` | 1600 × 960 | Hero, slide 2 (new arrivals) |
| `tario-hero-3-fresh.jpg` | 1600 × 960 | Hero, slide 3 (the produce aisle) |
| `tario-tile-breakfast.jpg` | 1000 × 1000 | Deals for every aisle: the large tile |
| `tario-tile-snacks.jpg` | 960 × 600 | Deals for every aisle |
| `tario-tile-bakery.jpg` | 960 × 600 | Deals for every aisle |
| `tario-tile-household.jpg` | 960 × 600 | Deals for every aisle |
| `tario-tile-meat.jpg` | 960 × 600 | Deals for every aisle |
| `tario-finds-produce.jpg` | 900 × 1200 | Fresh finds |
| `tario-finds-coffee.jpg` | 900 × 1200 | Fresh finds |
| `tario-finds-dinner.jpg` | 900 × 1200 | Fresh finds |

- `components/tario/tario-home.ts` picks them up at build time (`import.meta.glob`).
- A file that is missing is not an error: its slot shows a still life of the aisle's own
  products instead.
- `.jpg`, `.png` and `.webp` all work; keep each under about 450 KB.
- Rebuild and release the Layout after adding or replacing a photo.
