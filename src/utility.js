// Pulisce e normalizza l'input
export function sanitizeInput(input) {
  return input
    .trim()
    .replace(/[<>"']/g, "")
    .toLowerCase();
}
// Escape HTML per prevenire XSS
export function escapeHtml(text) {
  const div = document.createElement("div"); // Crea elemento temporaneo
  div.textContent = text; // Usa textContent per escape
  return div.innerHTML; // Ritorna HTML sicuro
}
// Mostra messaggi di stato
export function showMessage(container, message, type = "info") {
  container.style.display = "block"; // mostra il contenitore
  container.innerHTML = `
    <div class="status-message status-message--${type} fade-in">
      ${escapeHtml(message)}
    </div>
  `; // usa escapeHtml per sicurezza
  if (type === "success") {
    setTimeout(() => {
      container.innerHTML = ""; // pulisce il messaggio
      container.style.display = "none"; // nascondi se vuoto
    }, 5000);
  }
}
// Mostra indicatore di caricamento
export function showLoading(container, message = "Caricamento...") {
  container.innerHTML = `
    <div class="loading-text fade-in">
      <div class="spinner"></div>
      <span>${message}</span>
    </div>
  `;
}
// Aggiorna stato dell'applicazione
export function updateState(newState, elements) {
  elements.backBtn.style.display = newState === "home" ? "none" : "inline-flex"; // Mostra/Nascondi bottone indietro
  elements.searchBtn.disabled = newState === "loading"; // Disabilita bottone durante caricamento
  return newState;
}
