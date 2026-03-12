# Sredzka Korona

Statyczny frontend typu one-page pod GitHub Pages oraz backend i storage pod Cloudflare Workers + D1 + R2.

## Najwazniejsze katalogi

- [index.html](/Users/janicki/myApps/Sredzka-Korona/index.html) - glowna strona z osadzonym HTML, CSS i JS
- [admin/index.html](/Users/janicki/myApps/Sredzka-Korona/admin/index.html) - panel administratora
- [dokumenty/index.html](/Users/janicki/myApps/Sredzka-Korona/dokumenty/index.html) - osobna strona dokumentow
- [assets/js](/Users/janicki/myApps/Sredzka-Korona/assets/js) - frontend i panel
- [worker](/Users/janicki/myApps/Sredzka-Korona/worker) - API Cloudflare
- [WDROZENIE-CLOUDFLARE-GITHUB.md](/Users/janicki/myApps/Sredzka-Korona/WDROZENIE-CLOUDFLARE-GITHUB.md) - instrukcja wdrozenia

## Test lokalny

Do lokalnego podgladu nie otwieraj strony przez `file://`.

Uruchom:

```bash
npm run preview
```

Potem otworz:

```text
http://127.0.0.1:4173
```

W tym trybie publiczna strona dziala na lokalnych danych startowych. Formularz kontaktowy, kalendarz online i panel admina wymagaja podpietego API Cloudflare.

## Dane administratora

- login: `sredzka`
- haslo: `korona`

Hashe i pepper ustawiasz jako sekrety w Cloudflare zgodnie z instrukcja wdrozeniowa.
