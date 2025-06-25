// layout.js
document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch and inject HTML components
    const loadComponent = async (componentPath, targetId) => {
        const targetElement = document.getElementById(targetId);
        if (!targetElement) return;

        try {
            const response = await fetch(componentPath);
            if (!response.ok) throw new Error(`Could not load ${componentPath}`);
            const html = await response.text();
            targetElement.innerHTML = html;
        } catch (error) {
            console.error(error);
            targetElement.innerHTML = `<p style="color:red; text-align:center;">Failed to load component: ${componentPath}</p>`;
        }
    };

    // Load header and footer components
    const loadLayout = async () => {
        await loadComponent('nav.html', 'main-header');
        await loadComponent('footer.html', 'main-footer');
        
        // After loading layout, initialize any scripts that depend on them
        // We can call main script initializers here if needed, ensuring
        // the elements exist before the scripts try to access them.
        if (typeof initializePage !== 'undefined') {
            initializePage();
        }
    };

    loadLayout();
});