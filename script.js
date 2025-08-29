document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;

  // Load header, navbar, footer
  loadComponent("header", "components/header.html");
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");
  
  async function loadComponent(id, file) {
    const container = document.getElementById(id);
    if (!container) return;
    const res = await fetch(file);
    container.innerHTML = await res.text();
  }
});
