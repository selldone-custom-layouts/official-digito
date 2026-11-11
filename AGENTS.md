# AI Agent Entry Point

Detailed AI instructions and reusable custom Storefront Layout material live
in the dedicated [`.ai-agent/`](.ai-agent/) directory so they stay separate
from application source.

For tasks that customize, redesign, audit, package, or publish this Storefront
as a custom Selldone Layout, read these files completely:

1. [`.ai-agent/AGENTS.md`](.ai-agent/AGENTS.md)
2. [`.ai-agent/SKILL.md`](.ai-agent/SKILL.md)
3. [`.ai-agent/AI_WORKFLOW.md`](.ai-agent/AI_WORKFLOW.md) when GitHub setup,
   dependency synchronization, packaging, authentication, or deployment is in
   scope

The official Vue 3/Vite Storefront is the implementation baseline. This kit
does not authorize a framework replacement or a parallel storefront app; the
visual design may change completely while the platform and commerce contracts
remain intact. Do not change the official repository's Git remote model or run
release commands merely because this shim exists. Apply publication rules in
the owner's controlled clone, fork, or release branch.

## Language and currency (money and words)

The visitor's currency and language come from Selldone; the switcher is `components/region-switcher/` (a shared package: do not edit the copy; its guide is `new-shop-kits/region-switcher/PORTING.md`).

- **Every amount** goes through `money(amount, currency)` (`components/digito/digito-home.ts`): `amount` is in `currency` (a product's `currency`, a delivery way's `currency`, the basket's `currency`; omit it for the shop's base currency) and is shown in the visitor's currency, converted with the shop's rates. Never format with `$shop.currency` (it does not exist) or a fixed "USD".
- **Product prices** use `priceOf(shop, product, currentCurrency())` and format with the result's `currency`.
- **Words** go through `t("key", "English")` (a global in templates; `import { t } from "components/kalio/i18n/kalio-i18n"` in scripts). The shared Kalio words are in `components/kalio/i18n/base/<lang>.ts` (a copy of `new-shop-kits/i18n/kalio-base`), Digito's own in `components/kalio/i18n/digito.<lang>.ts` (keys `digito.*`), and a few base keys Digito says differently in `digito-overrides.ts`. The shop has en, ar (right to left), hi and da. After adding or changing a `t()` call, run `node new-shop-kits/i18n/tools/i18n-extract.cjs . <tmp>/base-en.ts components/kalio/i18n/digito.en.ts digito.`, translate the new keys in each `digito.<lang>.ts`, and check them with `i18n-lint.cjs`. A language the owner enables later: copy `base/<code>.ts`, write `digito.<code>.ts`, add `lang-<code>.ts` and one line in `components/kalio/i18n/index.ts`.
- **Check:** `components/region-switcher/tools/currency-check.cjs` (its first lines list Digito's selectors) must print `TOTAL 0`.

## Theme (palette, brand colour, light or dark, the visitor switcher)

When a merchant asks for a theme ("use the yellow theme", "my brand colour is #F5C400", "make it dark"), edit **one file only**: `components/digito/digito-theme.settings.ts`. Nothing else needs to change, and the colours are made readable automatically (buttons, links, header, dark mode).

| Setting | Allowed values |
| --- | --- |
| `palette` | `"blue"` (Digito blue, the default), `"emerald"`, `"violet"`, `"teal"`, `"orange"` |
| `brandColor` | any `"#RRGGBB"`; when set it replaces `palette` |
| `mode` | `"light"` or `"dark"` |
| `themeSwitcher` | `"showcase"` (the visitor switcher shows only on Digito's own showcase shop; the default), `"on"` (the merchant's visitors get a Theme row in the footer, just above the legal row), `"off"` |
| `textOnBrand` | only with `brandColor`: `"auto"` (a light brand such as yellow keeps its colour, with dark words on it) or `"white"` (white words; a light colour is darkened) |

Worked examples (change only these lines; leave the rest of the file as it is):

- **"Use the yellow theme"**: there is no tested yellow palette, so use a brand colour: `brandColor: "#F5C400", textOnBrand: "auto"`. Yellow buttons and header get dark words.
- **"My brand colour is #F5C400"**: `brandColor: "#F5C400", textOnBrand: "auto"`. Add `textOnBrand: "white"` instead if they want white words, in which case the colour is darkened.
- **"Make it dark"**: `mode: "dark"`.
- **"Let visitors switch themes"**: `themeSwitcher: "on"`.
- **"Remove the switcher"**: `themeSwitcher: "off"`. On a merchant's own shop it is already hidden with `"showcase"`.
- **"Go back to Digito's blue"**: remove `brandColor` and set `palette: "blue", mode: "light"`.

Then release and check:

1. Build and upload: `LAYOUT_ID=<your Layout id> SELLDONE_CLI_SRC=<cli clone> bash scripts/release.sh <new version>`; see the wiki page Build and Upload. Put the version live as in Go Live.
2. Check the contrast on the live shop. It must print `TOTAL 0`:
   ```sh
   PAGES="home=/,category=/<a category>,product=/product/<id>" node components/theme-switcher/tools/contrast-audit.cjs https://<your shop> "main"
   ```
   For a theme chosen in the settings, no `STORAGE` is needed: the settings are the default.
3. If the visitor switcher is on, its Theme row is in the footer (`components/kalio/shell/KalioFooter.vue`). Run the contrast audit again with a visitor's dark choice, `STORAGE='{"digito-theme":"{\"palette\":\"blue\",\"mode\":\"dark\"}"}'`; it must also print `TOTAL 0`.

More: the wiki page **Theme and colours** (`docs/wiki/Theme-and-colours.md`).
