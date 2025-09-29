#  CercaLibro

> Web app per cercare libri per **categoria** tramite Open Library — build con **Webpack 5**, deploy su **Firebase Hosting**.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Webpack](https://img.shields.io/badge/Build-Webpack_5-1f78c1?logo=webpack&logoColor=white)](https://webpack.js.org/)
[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase-ffca28?logo=firebase&logoColor=black)](https://firebase.google.com/docs/hosting)

## Live Demo
**https://open-library-703b1.web.app**

---

##  Caratteristiche
- ** Ricerca** per categoria con gestione stati (loading, error, empty)
- ** Responsive** (mobile-first con Grid/Flexbox)
- ** Accessibilità**: HTML semantico, ARIA, focus visibile
- ** Performance**: debounce input, rendering efficiente
- ** Build moderna**: bundling, minificazione, estrazione CSS, static assets

---

##  Stack
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Build**: Webpack 5 (`html-webpack-plugin`, `mini-css-extract-plugin`, `css-loader`, `style-loader`, `webpack-dev-server`)
- **Hosting**: Firebase Hosting
- **API**: [Open Library](https://openlibrary.org/developers/api)

---

## Avvio rapido

> **Requisiti:** Node.js 18+ consigliato

```bash
# 1) installa le dipendenze
npm install

# 2) sviluppo (autoreload)
npm run dev           # → http://localhost:5173

# 3) build di produzione
npm run build         # → genera /dist

# 4) anteprima della build
npm run preview       # → http://localhost:5000
```

---

##  Struttura del Progetto
```
.
├─ public/
│  ├─ index.html            # template HTML usato da HtmlWebpackPlugin
│  └─ favicon               #favicon
│                           
│
├─ src/
│  ├─ app.js                # logica dell'app (importa gli stili)
│  ├─ api.js                # logica chiamata API
│  └─ utility.js            # logica stato di caricamento e messaggi
│  └─ main.scss             # importa i partial sass
│  └─ _variables.scss       # variabili di stile
│  └─ _components.scss      # gestisce i componenti dell'app come bottoni/textbox
│  └─ _layout.scss          # gestisce il layout delle varie sezioni
│  └─ _typography.scss      # font e stili
│  └─ utilities.scss        # usato per fare il forward e rendere le variabili globali
│  └─ mixins.scss           # mixin hover e focus
│
├─ dist/                    
│  ├─ index.html
│  └─ assets/
│     ├─ js/                # bundle JS 
│     └─ css/               # CSS estratto 
│
├─ webpack.config.js        # configurazione build (dev/prod, loader, plugin)
├─ firebase.json            # configurazione Firebase Hosting
├─ .firebaserc              # associazione progetto Firebase
├─ package.json             # script e dipendenze
├─ package-lock.json
└─ .gitignore               # ignora node_modules/, dist/, .firebase/
└─ .gitattributes
└─ babelconfig.json
```

---

## Funzionalità Principali

### Ricerca Libri
- Ricerca per categoria con minimo 2 caratteri
- Sistema di cache per risultati frequenti
- Gestione errori con messaggi chiari
- Limitazione risultati (12 per ricerca)

### Visualizzazione
- Lista risultati con animazioni a cascata
- Dettagli libro con descrizione completa
- Navigazione fluida tra sezioni
- Stati di loading con spinner

### Accessibilità
- Navigazione completa da tastiera
- Screen reader friendly
- Alto contrasto e focus visibili
- ARIA labels e ruoli semantici

### Responsive Design
- Layout mobile-first
- Breakpoint: 768px, 480px
- Touch-friendly su dispositivi mobili
- Adattamento automatico contenuti

---

## Deploy su Firebase

Prerequisiti (una tantum):
- `firebase login`
- `firebase init hosting`  → **public directory:** `dist`  | **SPA:** No

Deploy:
```bash
npm run build
firebase deploy
```

> Config inclusa: `firebase.json`, `.firebaserc`.  
> Consigliato: header cache forte per `assets/**` (immutable, max-age 1y).

---

## Troubleshooting
- **Porta occupata (EADDRINUSE: 5173)** → `npm run dev -- --port 5174` oppure cambia `devServer.port`.
- **PowerShell blocca npm.ps1** → usa **cmd.exe** o `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.
- **Webpack: "'import' may appear only with 'sourceType: module'"** → usa `require('./style.css')`, oppure aggiungi `{ test: /.js$/, type: 'javascript/auto' }`, oppure rinomina `app.js` in `app.mjs` e aggiorna l'entry.

---

## Riconoscimenti
- **Open Library** per l'API gratuita

## 📜 Licenza
MIT — vedi [LICENSE](LICENSE).

