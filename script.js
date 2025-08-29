document.addEventListener('DOMContentLoaded', () => {
    // Load components
    loadComponent('header', '/components/header.html', () => {
        const pageTitle = document.body.getAttribute('data-title');
        const titleElement = document.getElementById('page-title');
        if (pageTitle && titleElement) {
            titleElement.textContent = pageTitle;
        }

        // Theme toggle logic (runs after header is loaded)
        const html = document.documentElement;
        const switchInput = document.getElementById('themeSwitch');
        const themeDisplay = document.querySelector('.theme-display');

        // Determine initial theme: saved > system > default light
        const saved = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initial = saved || (systemPrefersDark ? 'dark' : 'light');

        applyTheme(initial, false);
        if (switchInput) switchInput.checked = initial === 'dark';
        if (themeDisplay) themeDisplay.textContent = `Current Theme: ${initial.charAt(0).toUpperCase() + initial.slice(1)}`;

        // Toggle on click
        if (switchInput) {
            switchInput.addEventListener('change', (e) => {
                const newTheme = e.target.checked ? 'dark' : 'light';
                applyTheme(newTheme, true);
                if (themeDisplay) themeDisplay.textContent = `Current Theme: ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`;
            });
        }

        // Follow system theme changes if no saved preference
        if (!saved && window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                if (switchInput) switchInput.checked = newTheme === 'dark';
                applyTheme(newTheme, true, false);
                if (themeDisplay) themeDisplay.textContent = `Current Theme: ${newTheme.charAt(0).toUpperCase() + newTheme.slice(1)}`;
            });
        }
    });

    loadComponent('navbar', '/components/navbar.html', () => {
        // Set active link based on current page
        const currentPath = window.location.pathname === '/' ? 'index.html' : window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    });

    loadComponent('footer', '/components/footer.html');

    async function loadComponent(id, file, callback) {
        const container = document.getElementById(id);
        if (!container) {
            console.error(`Element with ID ${id} not found`);
            return;
        }
        try {
            const res = await fetch(file);
            if (!res.ok) throw new Error(`Failed to load ${file}: ${res.status}`);
            container.innerHTML = await res.text();
            if (callback) callback();
        } catch (error) {
            console.error(`Error loading component ${id}:`, error);
        }
    }

    function applyTheme(theme, animate = true, persist = true) {
        if (animate) {
            document.body.classList.add('theming');
            setTimeout(() => document.body.classList.remove('theming'), 350);
        }
        document.documentElement.setAttribute('data-theme', theme);
        if (persist) localStorage.setItem('theme', theme);
    }
});