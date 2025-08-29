document.addEventListener('DOMContentLoaded', () => {
  loadComponent("header", "components/header.html", () => {
    // Once header is loaded, set the page title from body attribute
    const pageTitle = document.body.getAttribute("data-title");
    const titleElement = document.getElementById("page-title");
    if (pageTitle && titleElement) {
      titleElement.textContent = pageTitle;
    }
  });
  loadComponent("navbar", "/components/navbar.html");
  loadComponent("footer", "/components/footer.html");

  async function loadComponent(id, file, callback) {
    const container = document.getElementById(id);
    if (!container) return;
    const res = await fetch(file);
    container.innerHTML = await res.text();
    if (callback) callback();
  }
});
