// Importa stili e librerie
import "./main.scss";
import debounce from "lodash/debounce";
import { fetchBooks, fetchBookDetails } from "./api.js";
import {
  sanitizeInput,
  escapeHtml,
  showMessage,
  showLoading,
  updateState,
} from "./utility.js";

//constanti per gli elementi DOM
const elements = {
  input: document.getElementById("categoria"), // Input di ricerca
  searchBtn: document.getElementById("searchBtn"), // Bottone di ricerca
  backBtn: document.getElementById("backBtn"), // Bottone indietro
  risultatiDiv: document.getElementById("risultati"), // Div risultati
  dettagliDiv: document.getElementById("dettagliLibri"), // Div dettagli
  statusDiv: document.getElementById("status-messages"), // Div messaggi di stato
};
// VARIABILI e COSTANTI
const MAX_RESULTS = 12;
const MIN_SEARCH_LENGTH = 2;
let currentState = "home"; // valori possibili: 'home', 'results', 'details'
let currentCategory = "";
let allBooks = [];
let searchCache = new Map();

// UI FUNCTIONS
// Crea card libro
function createBookCard(book, index) {
  const card = document.createElement("div"); // Crea card
  card.className = "libro-item"; // Classe per stile e animazioni

  const title = book.title || "Titolo non disponibile"; // Titolo
  const authors = book.authors // Autori
    ? book.authors.map((a) => a.name).join(", ") // Unisce nomi
    : "Autore non disponibile";
  // Contenuto card
  card.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p><strong>Autori:</strong> ${escapeHtml(authors)}</p>
    <button class="btn btn--primary" data-book-key="${book.key}">
      <span class="btn__text">Visualizza Dettagli</span>
      <span class="btn__loading">Caricamento...</span>
    </button>
  `; // Aggiunge listener al botton e apre dettagli
  // Apre dettagli al click sul bottone della

  card
    .querySelector("button")
    .addEventListener("click", () => handleShowDetails(book.key));

  elements.risultatiDiv.appendChild(card); // Aggiunge alla pagina
  setTimeout(() => card.classList.add("show"), index * 100); /// Animazione ingresso
}
// Mostra risultati ricerca
function renderResults(books) {
  elements.risultatiDiv.innerHTML = ""; // Pulisce risultati precedenti
  elements.statusDiv.innerHTML = ""; // Pulisce messaggi di stato

  const booksToShow = books.slice(0, MAX_RESULTS); // Limita risultati
  const total = books.length; // Numero totale risultati

  // Messaggio risultati
  if (total > MAX_RESULTS) {
    showMessage(
      elements.statusDiv,
      `Trovati ${total} libri. Mostrando i primi ${MAX_RESULTS}.`,
      "info"
    );
  } else {
    showMessage(elements.statusDiv, `Trovati ${total} libri.`, "success");
  }

  // Crea cards
  booksToShow.forEach((book, index) => createBookCard(book, index));
}

function renderBookDetails(bookData, title) {
  elements.risultatiDiv.innerHTML = ""; // Pulisce risultati
  elements.dettagliDiv.innerHTML = ""; // Pulisce dettagli precedenti
  elements.statusDiv.innerHTML = ""; // Pulisce messaggi di stato

  // Estrai descrizione
  let description = "Descrizione non disponibile.";
  // La descrizione può essere stringa o oggetto
  if (bookData.description) {
    if (typeof bookData.description === "string") {
      description = bookData.description; // Se è stringa
    } else if (bookData.description.value) {
      description = bookData.description.value; // Se è oggetto con valore
    }
  }

  // Limita lunghezza
  if (description.length > 1000) {
    description = description.substring(0, 1000) + "...";
  }
  // Crea dettagli
  elements.dettagliDiv.innerHTML = `
    <div class="book-details fade-in">
      <h2>${escapeHtml(title)}</h2>
      <div class="book-description">
        <h3>Descrizione</h3>
        <p>${escapeHtml(description)}</p>
      </div>
      ${
        bookData.first_publish_date // Data di prima pubblicazione
          ? `<p><strong>Prima pubblicazione:</strong> ${escapeHtml(
              bookData.first_publish_date
            )}</p>` // Mostra solo se disponibile
          : ""
      }
    </div>
  `;

  elements.dettagliDiv.classList.add("show"); // Mostra dettagli
}
// Pulisce interfaccia
function clearInterface() {
  elements.risultatiDiv.innerHTML = "";
  elements.dettagliDiv.innerHTML = "";
  elements.dettagliDiv.classList.remove("show");
  elements.statusDiv.innerHTML = "";
  elements.input.value = "";
}

// EVENT HANDLERS

//Gestione ricerca
async function handleSearch() {
  const input = elements.input.value; // Prende input
  const category = sanitizeInput(input); // Sanifica input
  // Controlla input
  if (!category || category.length < MIN_SEARCH_LENGTH) {
    showMessage(
      elements.statusDiv,
      "Inserisci almeno 2 caratteri per la ricerca.",
      "error"
    ); // Mostra errore
    elements.input.focus(); // Focus input
    return; // Esce dalla funzione
  }
  // Evita ricerche duplicate
  if (searchCache.has(category)) {
    allBooks = searchCache.get(category); // Recupera da cache
    currentState = updateState("results", elements); // Aggiorna stato
    renderResults(allBooks); // Mostra risultati
    return; // Esce dalla funzione
  }

  currentState = updateState("loading", elements); // Stato caricamento
  showLoading(elements.risultatiDiv, "Cercando libri..."); // Mostra caricamento
  elements.statusDiv.innerHTML = ""; // Pulisce messaggi di stato

  // Effettua ricerca
  try {
    const books = await fetchBooks(category); // Chiamata API

    if (searchCache.size >= 5) {
      const firstKey = searchCache.keys().next().value; // Rimuove la voce più vecchia
      searchCache.delete(firstKey); // Mantiene la cache piccola
    }
    searchCache.set(category, books);

    allBooks = books;
    currentState = updateState("results", elements); // Aggiorna stato
    renderResults(books); // Mostra risultati
  } catch (error) {
    console.error("Search error:", error); // Log errore
    elements.risultatiDiv.innerHTML = ""; // Pulisce risultati

    if (error.message === "NO_RESULTS") {
      showMessage(
        elements.statusDiv,
        `Nessun libro trovato per "${input}".`,
        "error"
      ); // Messaggio nessun risultato
    } else {
      showMessage(
        elements.statusDiv,
        "Errore durante la ricerca. Riprova più tardi.",
        "error"
      );
    } // Messaggio errore generico
    currentState = updateState("home", elements); // Torna a stato iniziale
  }
}

// Gestione apertura dettagli libro
async function handleShowDetails(bookKey) {
  const book = allBooks.find((b) => b.key === bookKey); // Trova libro
  const bookTitle = book ? book.title : "Libro"; // Titolo per header

  currentState = updateState("loading", elements); // Stato caricamento
  showLoading(elements.risultatiDiv, "Caricando dettagli..."); // Mostra caricamento

  try {
    const details = await fetchBookDetails(bookKey); // Chiamata API
    currentState = updateState("details", elements); // Aggiorna stato
    renderBookDetails(details, bookTitle); // Mostra dettagli
  } catch (error) {
    console.error("Details error:", error); // Log errore
    showMessage(
      elements.statusDiv,
      "Errore nel caricamento dei dettagli.",
      "error"
    ); // Messaggio errore
    currentState = updateState("results", elements); // Torna a risultati
    renderResults(allBooks); // Mostra risultati
  }
}

//Gestione ritorno indietro
function handleBack() {
  if (currentState === "details") {
    currentState = updateState("results", elements); // Torna a risultati
    renderResults(allBooks); // Mostra risultati
  } else {
    currentState = updateState("home", elements); // Torna a home
    clearInterface(); // Pulisce interfaccia
  }
}

function main() {
  console.log("Inizializzazione CercaLibro..."); // Messaggio console

  // Event listeners
  elements.searchBtn.addEventListener("click", handleSearch); // Cerca al click
  elements.backBtn.addEventListener("click", handleBack); // Indietro al click

  // Enter per cercare
  elements.input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene submit form
      handleSearch(); // Avvia ricerca
    }
  });

  // Clear errori quando si digita
  elements.input.addEventListener(
    "input",
    debounce(() => {
      const errorMessages = elements.statusDiv.querySelectorAll(
        ".status-message--error"
      );
      errorMessages.forEach((msg) => msg.remove()); // Rimuove messaggi di errore
    }, 500) // Debounce per evitare troppi eventi
  );

  // Stato iniziale

  currentState = updateState("home", elements); // Imposta stato iniziale
  elements.input.focus(); // Focus input
  console.log("CercaLibro inizializzato!"); // Messaggio console
}

document.addEventListener("DOMContentLoaded", main); // Avvia quando DOM è pronto
