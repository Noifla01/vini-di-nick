/* =====================================================================
   I VINI DI NICK – Script principale (JavaScript vanilla, nessun backend)
   1. Dati del locale (footer, contatti)
   2. Categorie
   3. Utility
   4. Parti comuni: barra categorie + footer
   5. Home: card categorie con numero di etichette
   6. Pagina categoria: lista, ricerca, ordinamento
   7. Avvio
   I vini sono in js/vini.js (unico file da modificare per la carta).
   ===================================================================== */

/* ---------- 1. Dati del locale ---------- */
const LOCALE = {
  nome: 'Le Tradizioni di Nick',
  indirizzo: 'Corso Giuseppe Garibaldi, 67',
  citta: '48011 Alfonsine (RA)',
  telefono: '+39 0544 84138',
  telefonoLink: '+39054484138',
  sito: 'https://www.letradizionidinick.it/',
  // Link "Indicazioni": apre Google Maps senza incorporare mappe (nessun cookie)
  mappa: 'https://www.google.com/maps/search/?api=1&query=Le+Tradizioni+di+Nick+Corso+Garibaldi+67+Alfonsine',
  social: {
    instagram: 'https://www.instagram.com/letradizionidinick/',
    facebook: 'https://www.facebook.com/leTradizionidiNick',
    tiktok: 'https://www.tiktok.com/@letradizionidinick',
  },
  // DA COMPLETARE con i dati della visura camerale
  ragioneSociale: '[Le Tradizioni S.r.l.]',
  piva: '[02596840393]',
  // Link portfolio Noifla (lasciare '#' finché non è online)
  noifla: '#',
};

/* ---------- 2. Categorie ---------- */
const CATEGORIE = {
  bianco:    { titolo: 'Bianchi',   pagina: 'bianchi.html',   icona: 'calice' },
  rosso:     { titolo: 'Rossi',     pagina: 'rossi.html',     icona: 'calice' },
  bollicine: { titolo: 'Bollicine', pagina: 'bollicine.html', icona: 'flute'  },
  rosato:    { titolo: 'Rosati',    pagina: 'rosati.html',    icona: 'calice' },
};

const BADGE = {
  casa:        { testo: 'I Vini di Nick', classe: 'badge-casa' },
  bio:         { testo: 'Biologico',      classe: 'badge-bio' },
  novita:      { testo: 'Novità',         classe: 'badge-novita' },
  consigliato: { testo: 'Consigliato',    classe: 'badge-consigliato' },
};

// Regione mostrata per prima (vini del territorio), le altre in ordine alfabetico
const REGIONE_PRIMA = 'Emilia-Romagna';

/* ---------- 3. Utility ---------- */
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const euro = n => '€ ' + Number(n).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// Testo senza accenti e minuscolo, per una ricerca più tollerante
const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const viniDisponibili = () => (typeof VINI !== 'undefined' ? VINI : []).filter(v => v.disponibile !== false);

function iconaCalice(tipo) {
  if (tipo === 'flute') {
    return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path class="liquido" d="M10.2 3h3.6l-.5 6c-.1 1.5-.6 2.5-1.3 3-.7-.5-1.2-1.5-1.3-3l-.5-6z"/>
      <path d="M10.2 3h3.6l-.5 6.5c-.1 2-1 3.5-1.3 3.5s-1.2-1.5-1.3-3.5L10.2 3z"/>
      <path d="M12 13v7M9.5 21h5"/>
      <circle cx="11.3" cy="5.5" r=".4"/><circle cx="12.7" cy="7.5" r=".4"/><circle cx="12" cy="4.2" r=".4"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path class="liquido" d="M7.6 7.5h8.8c-.2 2.8-2 5-4.4 5s-4.2-2.2-4.4-5z"/>
    <path d="M7.5 3h9c.3 5-1.8 9.5-4.5 9.5S7.2 8 7.5 3z"/>
    <path d="M12 12.5V20M8.5 21h7"/>
  </svg>`;
}

/* ---------- 4. Parti comuni ---------- */
function renderBarraCategorie(attiva) {
  const el = document.getElementById('barra-categorie');
  if (!el) return;
  el.innerHTML = `
    <a href="index.html" class="tab tab-home ${attiva ? '' : 'attiva'}" ${attiva ? '' : 'aria-current="page"'}>
      <i class="bi bi-grid" aria-hidden="true"></i><span>Carta</span>
    </a>
    ${Object.entries(CATEGORIE).map(([k, c]) => `
      <a href="${c.pagina}" class="tab tab-${k} ${k === attiva ? 'attiva' : ''}" ${k === attiva ? 'aria-current="page"' : ''}>
        <span class="tab-icona">${iconaCalice(c.icona)}</span><span>${c.titolo}</span>
      </a>`).join('')}`;
}

function renderFooter() {
  const el = document.getElementById('footer');
  if (!el) return;
  const L = LOCALE;
  el.innerHTML = `
    <div class="container">
      <div class="footer-griglia">
        <div>
          <p class="footer-marchio">I Vini <em>di Nick</em></p>
          <p class="mb-1"><a href="${L.sito}" target="_blank" rel="noopener">${esc(L.nome)}</a></p>
          <p class="mb-1">${esc(L.indirizzo)}<br>${esc(L.citta)}</p>
          <p class="mb-0"><a href="tel:${L.telefonoLink}"><i class="bi bi-telephone me-1" aria-hidden="true"></i>${esc(L.telefono)}</a></p>
        </div>
        <div class="footer-azioni">
          <a class="btn-oro-outline" href="${L.mappa}" target="_blank" rel="noopener">
            <i class="bi bi-geo-alt me-1" aria-hidden="true"></i>Indicazioni
          </a>
          <div class="social">
            <a href="${L.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
            <a href="${L.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
            <a href="${L.social.tiktok}" target="_blank" rel="noopener" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>
          </div>
        </div>
      </div>
      <div class="footer-legale">
        <span>© ${new Date().getFullYear()} ${esc(L.ragioneSociale)} – P.IVA ${esc(L.piva)}</span>
        <a href="privacy.html">Privacy e cookie</a>
        <a href="${L.noifla}" target="_blank" rel="noopener noreferrer" class="credit-link"
           aria-label="Created by Noifla Digital Studio (si apre in una nuova scheda)">
          <svg class="credit-icon" viewBox="0 0 64 64" width="18" height="18" aria-hidden="true" focusable="false">
            <rect x="2" y="2" width="60" height="60" rx="16" fill="none" stroke="currentColor" stroke-width="3" opacity=".45"/>
            <g fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 44V20" stroke="currentColor"/>
              <path d="M38 44V20" stroke="currentColor"/>
              <path d="M18 20L38 44" class="credit-accent"/>
            </g>
            <rect x="44" y="39" width="6" height="6" rx="1" class="credit-accent-fill"/>
          </svg>
          <span>Created by <strong>Noifla Digital Studio</strong></span>
        </a>
      </div>
    </div>`;
}

/* ---------- 5. Home ---------- */
function renderHome() {
  const el = document.getElementById('griglia-categorie');
  if (!el) return;
  const vini = viniDisponibili();
  el.innerHTML = Object.entries(CATEGORIE).map(([k, c]) => {
    const n = vini.filter(v => v.categoria === k).length;
    return `
      <a href="${c.pagina}" class="card-categoria card-${k}">
        <span class="card-icona">${iconaCalice(c.icona)}</span>
        <span class="card-titolo">${c.titolo}</span>
        <span class="card-conteggio">${n} ${n === 1 ? 'etichetta' : 'etichette'}</span>
        <i class="bi bi-arrow-right card-freccia" aria-hidden="true"></i>
      </a>`;
  }).join('');
}

/* ---------- 6. Pagina categoria ---------- */
function cardVino(v) {
  const badge = (v.badge || []).filter(b => BADGE[b])
    .map(b => `<span class="badge-vino ${BADGE[b].classe}">${BADGE[b].testo}</span>`).join('');
  const dettagli = [v.vitigni, v.annata].filter(Boolean).map(esc).join(' · ');
  const foto = v.immagine
    ? `<img src="${esc(v.immagine)}" alt="Bottiglia di ${esc(v.nome)}" width="480" height="640" loading="lazy"
         onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'foto-vuota',innerHTML:iconaCalice('calice')}))">`
    : `<span class="foto-vuota">${iconaCalice('calice')}</span>`;

  return `
    <li class="vino">
      <details>
        <summary>
          <span class="vino-foto">${foto}</span>
          <span class="vino-testo">
            <span class="vino-nome">${esc(v.nome)}</span>
            <span class="vino-cantina">${esc(v.cantina)}</span>
            <span class="vino-info">${dettagli}</span>
            ${badge ? `<span class="vino-badge">${badge}</span>` : ''}
          </span>
          <span class="vino-prezzo">
            ${euro(v.prezzo)}
            ${v.prezzoCalice ? `<small>calice ${euro(v.prezzoCalice)}</small>` : ''}
            <i class="bi bi-chevron-down vino-apri" aria-hidden="true"></i>
          </span>
        </summary>
        <div class="vino-dettagli">
          <p>${esc(v.descrizione)}</p>
          ${v.abbinamenti ? `<p class="vino-abbinamenti"><i class="bi bi-egg-fried me-1" aria-hidden="true"></i><strong>Abbinamenti:</strong> ${esc(v.abbinamenti)}</p>` : ''}
          <p class="vino-regione"><i class="bi bi-geo me-1" aria-hidden="true"></i>${esc(v.regione)}</p>
        </div>
      </details>
    </li>`;
}

function ordinaRegioni(a, b) {
  if (a === REGIONE_PRIMA) return -1;
  if (b === REGIONE_PRIMA) return 1;
  const estA = /\(/.test(a), estB = /\(/.test(b); // es. "Champagne (Francia)" in fondo
  if (estA !== estB) return estA ? 1 : -1;
  return a.localeCompare(b, 'it');
}

function renderCategoria(cat) {
  const lista = document.getElementById('lista-vini');
  const cerca = document.getElementById('cerca');
  const ordina = document.getElementById('ordina');
  const conteggio = document.getElementById('conteggio');
  const vuoto = document.getElementById('nessun-risultato');
  const tutti = viniDisponibili().filter(v => v.categoria === cat);

  conteggio.textContent = `${tutti.length} ${tutti.length === 1 ? 'etichetta' : 'etichette'}`;

  function disegna() {
    const q = norm(cerca.value.trim());
    const modo = ordina.value;
    let vini = tutti.filter(v => !q ||
      norm([v.nome, v.cantina, v.vitigni, v.regione, v.annata].join(' ')).includes(q));

    vuoto.hidden = vini.length > 0;

    if (modo === 'regione') {
      const gruppi = {};
      vini.forEach(v => (gruppi[v.regione] ||= []).push(v));
      lista.innerHTML = Object.keys(gruppi).sort(ordinaRegioni).map(r => `
        <section class="gruppo-regione" aria-label="${esc(r)}">
          <h2 class="titolo-regione">${esc(r)} <span>${gruppi[r].length}</span></h2>
          <ul class="lista">${gruppi[r].sort((a, b) => a.prezzo - b.prezzo).map(cardVino).join('')}</ul>
        </section>`).join('');
    } else {
      const fn = {
        'prezzo-su': (a, b) => a.prezzo - b.prezzo,
        'prezzo-giu': (a, b) => b.prezzo - a.prezzo,
        'nome': (a, b) => a.nome.localeCompare(b.nome, 'it'),
      }[modo];
      lista.innerHTML = `<ul class="lista">${vini.sort(fn).map(cardVino).join('')}</ul>`;
    }
  }

  cerca.addEventListener('input', disegna);
  ordina.addEventListener('change', disegna);
  disegna();
}

/* ---------- 7. Avvio ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const cat = document.body.dataset.categoria || '';

  // Compatibilità con i vecchi link del sito precedente (es. #/categoria/rosso)
  const vecchio = location.hash.match(/^#\/categoria\/(\w+)/);
  if (vecchio) {
    const mappa = { bianco: 'bianchi.html', rosso: 'rossi.html', bollicina: 'bollicine.html', rose: 'rosati.html' };
    if (mappa[vecchio[1]]) { location.replace(mappa[vecchio[1]]); return; }
  }

  renderBarraCategorie(CATEGORIE[cat] ? cat : '');
  renderFooter();
  if (CATEGORIE[cat]) renderCategoria(cat);
  else renderHome();
});
