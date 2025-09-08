# 📚 CercaLibro

> Un'applicazione web moderna per la ricerca di libri per categoria, alimentata dall'API di Open Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 🌟 Caratteristiche

- **🔍 Ricerca intelligente**: Trova libri per categoria con sistema di cache
- **📱 Responsive**: Perfettamente adattato a tutti i dispositivi
- **♿ Accessibile**: Supporto completo per screen reader e navigazione da tastiera
- **⚡ Performance**: Caricamento veloce con debounce e ottimizzazioni
- **🎨 UI Moderna**: Design pulito con animazioni fluide
- **🛡️ Sicuro**: Sanitizzazione input e protezione XSS
- **🔄 Stati dinamici**: Feedback visivo per loading, errori e successo

## 🚀 Demo Live

[Visualizza Demo](https://tuodominio.github.io/cercalibro) <!-- Sostituisci con il tuo link -->

## 🛠️ Tecnologie Utilizzate

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript ES6+
- **API**: [Open Library API](https://openlibrary.org/developers/api)
- **Design**: Mobile-first, Progressive Enhancement
- **Accessibilità**: ARIA attributes, semantic HTML
- **Performance**: Debouncing, caching, lazy loading

## 🏃‍♂️ Come Usare

1. **Avvia l'applicazione**:
   ```bash
   # Con un server locale (consigliato)
   python -m http.server 3000
   # oppure
   npx serve .
   
   # Poi visita http://localhost:3000
   ```

2. **Oppure apri direttamente**:
   - Apri `index.html` nel browser
   - ⚠️ Alcune funzionalità potrebbero non funzionare senza server

3. **Inizia a cercare**:
   - Inserisci una categoria (es. "fantasy", "horror", "science")
   - Clicca "Cerca" o premi Invio
   - Esplora i risultati e visualizza i dettagli

## 📁 Struttura del Progetto

```
cercalibro/
├── index.html              # Pagina principale
├── assets/
│   ├── css/
│   │   └── style.css       # Stili principali
│   └── js/
│       └── app.js          # Logica applicazione
├── screenshots/            # Screenshot per README
├── README.md              # Questo file
└── LICENSE                # Licenza MIT
```

## 🎯 Funzionalità Principali

### 🔍 Ricerca Libri
- Ricerca per categoria con minimo 2 caratteri
- Sistema di cache per risultati frequenti
- Gestione errori con messaggi chiari
- Limitazione risultati (12 per ricerca)

### 📖 Visualizzazione
- Lista risultati con animazioni a cascata
- Dettagli libro con descrizione completa
- Navigazione fluida tra sezioni
- Stati di loading con spinner

### ♿ Accessibilità
- Navigazione completa da tastiera
- Screen reader friendly
- Alto contrasto e focus visibili
- ARIA labels e ruoli semantici

### 📱 Responsive Design
- Layout mobile-first
- Breakpoint: 768px, 480px
- Touch-friendly su dispositivi mobili
- Adattamento automatico contenuti

## 🔧 API Reference

L'app utilizza l'[Open Library API](https://openlibrary.org/developers/api):

## 📜 Licenza

Questo progetto è sotto licenza MIT. Vedi il file [LICENSE](LICENSE) per i dettagli.

## 🙏 Riconoscimenti

- **Open Library** per l'API gratuita
- **Community** per feedback e suggerimenti
- **Icone** da [Lucide Icons](https://lucide.dev/)

---

<p align="center">
  Fatto con ❤️ in Italia<br>
  <sub>⭐ Lascia una stella se il progetto ti è piaciuto!</sub>
</p>
