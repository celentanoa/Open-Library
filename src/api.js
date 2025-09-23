import axios from "axios";
const API_URL = "https://openlibrary.org";

/**
 * Recupera libri da Open Library (con axios)
 * @param {string} category - la categoria da cercare (es. "fantasy")
 * @returns {Array} lista di libri (works)
 */

export async function fetchBooks(category) {
  const url = `${API_URL}/subjects/${encodeURIComponent(category)}.json`; // URL con categoria sanificata

  try {
    const { data } = await axios.get(url);
    if (!data.works || data.works.length === 0) throw new Error("NO_RESULTS"); // Nessun risultato
    return data.works; // Ritorna lista di libri
  } catch (error) {
    console.error("Errore fetchBooks:", error); // Log errore
    throw new Error("Errore durante il recupero dei libri"); // Rilancia errore
  }
}

/**
 * Recupera i dettagli di un libro (con axios)
 * @param {string} bookKey - la chiave del libro (es. "/works/OL12345W")
 * @returns {Object} dettagli del libro
 */

export async function fetchBookDetails(bookKey) {
  const url = `${API_URL}${bookKey}.json`; // URL dettagli libro
  try {
    const { data } = await axios.get(url); // axios fa già il parsing JSON
    return data;
  } catch (error) {
    console.error("Errore fetchBookDetails:", error); // Log errore
    throw new Error("Errore durante il recupero dei dettagli"); // Rilancia errore
  }
}
