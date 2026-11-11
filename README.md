# I Vini di Nick – Carta dei vini online

Sito statico (HTML + CSS + Bootstrap 5.3 + JavaScript vanilla), senza backend né database.
Si apre dai QR code stampati sulla carta cartacea ed è pensato per smartphone.

## Struttura

```
index.html        pagina iniziale con le 4 categorie
bianchi.html      vini bianchi
rossi.html        vini rossi
bollicine.html    bollicine
rosati.html       rosati
privacy.html      informativa privacy e cookie
css/style.css     grafica
js/vini.js        ← I DATI DEI VINI (unico file da modificare per la carta)
js/main.js        logica del sito + dati del locale (footer)
img/vini/         foto delle bottiglie (WebP, 480×640)
img/favicon.svg   icona della scheda
```

## Aggiornare la carta

Apri `js/vini.js` (anche dal sito di GitHub: apri il file → icona matita → modifica → "Commit changes"):

- **prezzo:** cambia `prezzo: 28,` (decimali con il punto: `28.5`)
- **vino finito:** `disponibile: false` (sparisce dalla carta, non serve cancellarlo)
- **nuovo vino:** copia un blocco `{ ... },`, cambia i dati e usa un `id` nuovo
- **foto nuova:** carica il file in `img/vini/` (meglio verticale 3:4, WebP o JPG) e scrivi il percorso in `immagine`

Dopo il commit, GitHub Pages aggiorna il sito in 1-2 minuti.
Se modifichi `css/style.css` o `js/main.js`, aumenta il numero `?v=1` → `?v=2` nei file HTML.

## Dati del locale

In cima a `js/main.js` (oggetto `LOCALE`): indirizzo, telefono, social,
**ragione sociale e P.IVA da completare**, link portfolio Noifla.
Completa anche i campi gialli in `privacy.html`.

## Pubblicazione su GitHub Pages

1. Carica il **contenuto** di questa cartella nella radice del repository (index.html in primo piano).
2. Settings → Pages → Source: "Deploy from a branch" → `main` / `/ (root)` → Save.
3. Indirizzo: `https://noifla01.github.io/cantina-nick/`
# vini-di-nick
