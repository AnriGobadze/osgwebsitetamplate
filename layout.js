document.addEventListener('DOMContentLoaded', () => {
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

    const loadLayout = async () => {
        await loadComponent('nav.html', 'main-header');
        await loadComponent('footer.html', 'main-footer');
        
        if (document.body.classList.contains('home-page')) {
            if (typeof startHomepageAnimation !== 'undefined') {
                startHomepageAnimation();
            }
        } else {
            // MODIFICATION IS HERE: Added a dynamic entrance for other pages
            const navBar = document.querySelector('.navbar');
            if (navBar) {
                navBar.classList.add('scrolled');
                gsap.fromTo('.logo', 
                    { y: -30, opacity: 0 }, 
                    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
                gsap.fromTo('.nav-links a',
                    { y: -30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.4)', stagger: 0.07, delay: 0.2 }
                );
            }
            if (typeof initializePage !== 'undefined') {
                initializePage();
            }
        }
    };

    loadLayout();
});