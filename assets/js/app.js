// VARIABILI GLOBALI
const API_URL = "https://openlibrary.org";
const MAX_RESULTS = 12;
const MIN_SEARCH_LENGTH = 2;

let currentState = "home"; // 'home', 'results', 'details'
let currentCategory = "";
let allBooks = [];
let searchCache = new Map();

const elements = {
  input: document.getElementById("categoria"),
  searchBtn: document.getElementById("searchBtn"),
  backBtn: document.getElementById("backBtn"),
  risultatiDiv: document.getElementById("risultati"),
  dettagliDiv: document.getElementById("dettagliLibri"),
  statusDiv: document.getElementById("status-messages"),
};

//FUNCTIONS

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>"']/g, "")
    .toLowerCase();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showMessage(message, type = "info") {
  elements.statusDiv.innerHTML = `
    <div class="status-message status-message--${type} fade-in">
      ${escapeHtml(message)}
    </div>
  `;

  // Auto-rimuovi messaggi di successo
  if (type === "success") {
    setTimeout(() => (elements.statusDiv.innerHTML = ""), 5000);
  }
}

function showLoading(container, message = "Caricamento...") {
  container.innerHTML = `
    <div class="loading-text fade-in">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
}

function updateState(newState) {
  currentState = newState;
  elements.backBtn.style.display = newState === "home" ? "none" : "inline-flex";
  elements.searchBtn.disabled = newState === "loading";
}

// API FUNCTIONS

async function fetchBooks(category) {
  const url = `${API_URL}/subjects/${encodeURIComponent(category)}.json`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!data.works || data.works.length === 0) {
    throw new Error("NO_RESULTS");
  }

  return data.works;
}

async function fetchBookDetails(bookKey) {
  const url = `${API_URL}${bookKey}.json`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

// UI FUNCTIONS

function createBookCard(book, index) {
  const card = document.createElement("div");
  card.className = "libro-item";

  const title = book.title || "Titolo non disponibile";
  const authors = book.authors
    ? book.authors.map((a) => a.name).join(", ")
    : "Autore non disponibile";

  card.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p><strong>Autori:</strong> ${escapeHtml(authors)}</p>
    <button class="btn btn--primary" data-book-key="${book.key}">
      <span class="btn__text">Visualizza Dettagli</span>
      <span class="btn__loading">Caricamento...</span>
    </button>
  `;

  // Event listener
  card
    .querySelector("button")
    .addEventListener("click", () => handleShowDetails(book.key));

  elements.risultatiDiv.appendChild(card);

  // Animazione cascata
  setTimeout(() => card.classList.add("show"), index * 100);
}

function renderResults(books) {
  elements.risultatiDiv.innerHTML = "";
  elements.statusDiv.innerHTML = "";

  const booksToShow = books.slice(0, MAX_RESULTS);
  const total = books.length;

  // Messaggio risultati
  if (total > MAX_RESULTS) {
    showMessage(
      `Trovati ${total} libri. Mostrando i primi ${MAX_RESULTS}.`,
      "info"
    );
  } else {
    showMessage(`Trovati ${total} libri.`, "success");
  }

  // Crea cards
  booksToShow.forEach((book, index) => createBookCard(book, index));
}

function renderBookDetails(bookData, title) {
  elements.risultatiDiv.innerHTML = "";
  elements.dettagliDiv.innerHTML = "";
  elements.statusDiv.innerHTML = "";

  // Estrai descrizione
  let description = "Descrizione non disponibile.";
  if (bookData.description) {
    if (typeof bookData.description === "string") {
      description = bookData.description;
    } else if (bookData.description.value) {
      description = bookData.description.value;
    }
  }

  // Limita lunghezza
  if (description.length > 1000) {
    description = description.substring(0, 1000) + "...";
  }

  elements.dettagliDiv.innerHTML = `
    <div class="book-details fade-in">
      <h2>${escapeHtml(title)}</h2>
      <div class="book-description">
        <h3>Descrizione</h3>
        <p>${escapeHtml(description)}</p>
      </div>
      ${
        bookData.first_publish_date
          ? `<p><strong>Prima pubblicazione:</strong> ${escapeHtml(
              bookData.first_publish_date
            )}</p>`
          : ""
      }
    </div>
  `;

  elements.dettagliDiv.classList.add("show");
}

function clearInterface() {
  elements.risultatiDiv.innerHTML = "";
  elements.dettagliDiv.innerHTML = "";
  elements.dettagliDiv.classList.remove("show");
  elements.statusDiv.innerHTML = "";
  elements.input.value = "";
}

// EVENT HANDLERS

async function handleSearch() {
  const input = elements.input.value;
  const category = sanitizeInput(input);

  // Validazione
  if (!category || category.length < MIN_SEARCH_LENGTH) {
    showMessage("Inserisci almeno 2 caratteri per la ricerca.", "error");
    elements.input.focus();
    return;
  }

  // Cache check
  if (searchCache.has(category)) {
    console.log("Using cached results");
    allBooks = searchCache.get(category);
    currentCategory = category;
    updateState("results");
    renderResults(allBooks);
    return;
  }

  // Loading state
  updateState("loading");
  currentCategory = category;
  showLoading(elements.risultatiDiv, "Cercando libri...");
  elements.statusDiv.innerHTML = "";

  try {
    const books = await fetchBooks(category);

    // Salva in cache (max 5 ricerche)
    if (searchCache.size >= 5) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(category, books);

    allBooks = books;
    updateState("results");
    renderResults(books);
  } catch (error) {
    console.error("Search error:", error);
    elements.risultatiDiv.innerHTML = "";

    if (error.message === "NO_RESULTS") {
      showMessage(
        `Nessun libro trovato per "${input}". Prova con un termine diverso.`,
        "error"
      );
    } else {
      showMessage("Errore durante la ricerca. Riprova più tardi.", "error");
    }

    updateState("home");
  }
}

async function handleShowDetails(bookKey) {
  const book = allBooks.find((b) => b.key === bookKey);
  const bookTitle = book ? book.title : "Libro";

  updateState("loading");
  showLoading(elements.risultatiDiv, "Caricando dettagli...");

  try {
    const details = await fetchBookDetails(bookKey);
    updateState("details");
    renderBookDetails(details, bookTitle);
  } catch (error) {
    console.error("Details error:", error);
    showMessage("Errore nel caricamento dei dettagli.", "error");
    updateState("results");
    renderResults(allBooks);
  }
}

function handleBack() {
  if (currentState === "details") {
    updateState("results");
    renderResults(allBooks);
  } else {
    updateState("home");
    clearInterface();
  }
}

function init() {
  console.log("Inizializzazione CercaLibro...");

  // Event listeners
  elements.searchBtn.addEventListener("click", handleSearch);
  elements.backBtn.addEventListener("click", handleBack);

  // Enter per cercare
  elements.input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });

  // Clear errori quando si digita
  elements.input.addEventListener(
    "input",
    debounce(() => {
      const errorMessages = elements.statusDiv.querySelectorAll(
        ".status-message--error"
      );
      errorMessages.forEach((msg) => msg.remove());
    }, 500)
  );

  // Stato iniziale
  updateState("home");
  elements.input.focus();

  console.log("CercaLibro inizializzato!");
}

// Avvio
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
