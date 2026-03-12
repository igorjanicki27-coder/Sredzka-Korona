# Wdrozenie: OVH + GitHub + Cloudflare

## Architektura

- `OVH` zostaje rejestratorem domeny.
- `Cloudflare` przejmuje DNS dla domeny i wystawia API Workera na subdomenie `api.twoja-domena.pl`.
- `GitHub Pages` publikuje strone statyczna pod domena glowna `twoja-domena.pl` lub `www.twoja-domena.pl`.
- `Cloudflare D1` przechowuje tresci, zgoszenia i kalendarz.
- `Cloudflare R2` przechowuje zdjecia i dokumenty.

To oznacza, ze nie uruchamiasz zadnego lokalnego serwera. Zmiany frontendu wrzucasz do GitHuba, a panel admina zapisuje dane do Cloudflare.

## 1. Konto Cloudflare

1. Wejdz na [Cloudflare Dashboard](https://dash.cloudflare.com/sign-up) i zaloz darmowe konto.
2. Potwierdz adres e-mail.
3. W panelu kliknij `Add a domain`.
4. Wpisz swoja domena z OVH, np. `twoja-domena.pl`.
5. Wybierz plan `Free`.
6. Cloudflare pokaze rekordy DNS i dwa nameserwery.
7. Zaloguj sie do OVH, przejdz do zarzadzania domena i podmien nameserwery na te z Cloudflare.
8. Wroc do Cloudflare i poczekaj, az domena przejdzie w status `Active`.

Dokumentacja:
- [Set up a zone](https://developers.cloudflare.com/fundamentals/setup/manage-domains/add-site/)
- [Change nameservers at your registrar](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)

## 2. GitHub Pages pod domena z OVH

1. Utworz repozytorium GitHub i wrzuc do niego ten projekt.
2. W GitHub przejdz do `Settings` -> `Pages`.
3. Jako source wybierz `Deploy from a branch`.
4. Wybierz branch `main` i folder `/root`.
5. W polu `Custom domain` wpisz swoja domene, np. `twoja-domena.pl`.
6. W Cloudflare DNS dodaj rekordy:
   - `A` dla `@` na `185.199.108.153`
   - `A` dla `@` na `185.199.109.153`
   - `A` dla `@` na `185.199.110.153`
   - `A` dla `@` na `185.199.111.153`
   - `CNAME` dla `www` na `twoj-login.github.io`
7. Wlacz `Enforce HTTPS` w GitHub Pages, gdy certyfikat bedzie gotowy.

Dokumentacja:
- [Configuring a custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 3. Cloudflare D1

1. W Cloudflare otworz `Storage & Databases` -> `D1 SQL Database`.
2. Kliknij `Create`.
3. Nazwij baze `sredzka-korona`.
4. Po utworzeniu skopiuj `Database ID`.
5. W pliku [worker/wrangler.jsonc](/Users/janicki/myApps/Sredzka-Korona/worker/wrangler.jsonc) wklej ten identyfikator w `database_id`.
6. W zakladce SQL uruchom zawartosc pliku [worker/schema.sql](/Users/janicki/myApps/Sredzka-Korona/worker/schema.sql).

Dokumentacja:
- [Create a D1 database](https://developers.cloudflare.com/d1/get-started/)

## 4. Cloudflare R2

1. W Cloudflare otworz `Storage & Databases` -> `R2`.
2. Kliknij `Create bucket`.
3. Nazwij bucket `sredzka-korona-media`.
4. Nic nie musisz wystawiac publicznie. Pliki beda serwowane przez Workera.

Dokumentacja:
- [Create a bucket in R2](https://developers.cloudflare.com/r2/get-started/)

## 5. Worker API

1. Wejdz do `Workers & Pages`.
2. Kliknij `Create`.
3. Wybierz `Import a repository` albo utworz projekt z `Hello World` i podmien pliki z katalogu [worker](/Users/janicki/myApps/Sredzka-Korona/worker).
4. Jesli importujesz repo:
   - wskaz ten repozytorium,
   - jako root directory ustaw `worker`,
   - framework preset ustaw na `None`.
5. W ustawieniach Workera dodaj bindingi:
   - `D1 database binding`: `DB`
   - `R2 bucket binding`: `MEDIA_BUCKET`
6. Dodaj zmienna:
   - `ALLOWED_ORIGIN=https://twoja-domena.pl`
7. Dodaj sekrety:
   - `AUTH_PEPPER`
   - `ADMIN_LOGIN_HASH`
   - `ADMIN_PASSWORD_HASH`
   - opcjonalnie `TURNSTILE_SECRET`

Hashowanie danych administratora:

1. W terminalu uruchom:

```bash
node scripts/generate-admin-hashes.mjs MOJ_BARDZO_TAJNY_PEPPER
```

2. Skopiuj wynik i wpisz do sekretow Workera:
   - `AUTH_PEPPER`
   - `ADMIN_LOGIN_HASH`
   - `ADMIN_PASSWORD_HASH`

Login pozostaje:
- login: `sredzka`
- haslo: `korona`

Hashe beda trzymane po stronie Cloudflare, nie w publicznym frontendzie.

Dokumentacja:
- [Workers Git integration](https://developers.cloudflare.com/workers/ci-cd/builds/)
- [Bindings in Workers](https://developers.cloudflare.com/workers/runtime-apis/bindings/)
- [Environment variables and secrets](https://developers.cloudflare.com/workers/configuration/secrets/)

## 6. Subdomena API

1. W ustawieniach Workera dodaj `Custom Domain`.
2. Ustaw subdomene `api.twoja-domena.pl`.
3. Cloudflare sam doda odpowiedni rekord DNS.

Po tym frontend bedzie komunikowal sie z API pod `https://api.twoja-domena.pl`.

Dokumentacja:
- [Custom domains for Workers](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

## 7. Turnstile do formularza kontaktowego

1. W Cloudflare wejdz do `Turnstile`.
2. Kliknij `Add site`.
3. Podaj domena strony.
4. Skopiuj `site key` i `secret key`.
5. `secret key` dodaj do sekretow Workera jako `TURNSTILE_SECRET`.
6. `site key` wpisz w pliku [assets/js/config.js](/Users/janicki/myApps/Sredzka-Korona/assets/js/config.js) jako `turnstileSiteKey`.

Dokumentacja:
- [Cloudflare Turnstile getting started](https://developers.cloudflare.com/turnstile/get-started/)

## 8. Konfiguracja frontendu

W pliku [assets/js/config.js](/Users/janicki/myApps/Sredzka-Korona/assets/js/config.js):

```js
window.SREDZKA_CONFIG = {
  apiBase: "https://api.twoja-domena.pl",
  turnstileSiteKey: "WKLEJ_TUTAJ_SITE_KEY",
};
```

Jesli nie wpiszesz `apiBase`, frontend probuje uzyc `https://api.twoja-domena.pl` automatycznie tylko wtedy, gdy strona dziala juz na wlasnej domenie.

## 9. Co wrzucasz gdzie

- Do `GitHub`:
  - wszystkie pliki frontendu,
  - panel admina,
  - kod Workera,
  - instrukcje.
- Do `Cloudflare`:
  - baza D1,
  - pliki w R2,
  - API Workera,
  - sekrety i formularz Turnstile.

## 10. Rzeczy, ktore warto zrobic od razu

- Po pierwszym wdrozeniu zmien haslo administratora na mocniejsze niz `korona`.
- Dodaj drugi adres e-mail do odzyskiwania konta Cloudflare.
- Wlacz 2FA na GitHub i Cloudflare.
- Ustal, czy `www` ma przekierowywac na `@`, czy odwrotnie.
- Przetestuj upload duzych paczek zdjec na jednym albumie, zanim wrzucisz cala biblioteke.

