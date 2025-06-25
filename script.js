// script.js (V3 - The Signature Edition)

function initializePage() {
    const burgerMenuButton = document.getElementById('burger-menu');
    const overlay = document.getElementById('mobile-nav-overlay');

    const toggleNav = () => {
        const isExpanded = document.body.classList.toggle('mobile-nav-active');
        burgerMenuButton.setAttribute('aria-expanded', isExpanded);
    };

    if (burgerMenuButton) burgerMenuButton.addEventListener('click', toggleNav);
    if (overlay) overlay.addEventListener('click', toggleNav);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    
    // --- [MODIFIED] Observer for all pages EXCEPT the menu items ---
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px', threshold: 0.1 });
    revealElements.forEach(elem => observer.observe(elem));
}

document.addEventListener('DOMContentLoaded', () => {
    // This MUST be called here, right after the layout components are requested by layout.js,
    // to ensure elements like the navbar and footer exist before this script tries to manipulate them.
    // We defer the execution slightly to ensure layout.js has finished fetching.
    setTimeout(initializePage, 0);

    if (document.body.classList.contains('menu-page')) {
        const SUPABASE_URL = 'https://pcqwsjrratkkunoqstzo.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcXdzanJyYXRra3Vub3FzdHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3ODI1MjEsImV4cCI6MjA2NjM1ODUyMX0.NlxFEsmFJ5M2z32pBA8KgLoZ7EegNfo8KZmoJ7B69CE';
        const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const menuGrid = document.getElementById('menu-grid');
        const menuFilters = document.getElementById('menu-filters');
        
        if (!menuGrid || !menuFilters) return;

        let allMeals = [];
        const fallbackImage = 'https://via.placeholder.com/150x150.png/1a1a1a/888888?text=No+Image';

        const displayMenuItems = (items) => {
            menuGrid.innerHTML = '';
            if (items.length === 0) {
                menuGrid.innerHTML = '<p class="info-message">No items for this category.</p>';
                return;
            }
            items.forEach(item => {
                const card = document.createElement('div');
                // --- [REMOVED] 'reveal' class is no longer added to menu cards for better scroll performance ---
                card.className = 'menu-card';
                card.innerHTML = `
                    <img 
                        src="${item.image || fallbackImage}" 
                        alt="${item.name}" 
                        class="card-img" 
                        loading="lazy" 
                        onerror="this.onerror=null; this.src='${fallbackImage}';"
                    >
                    <div class="card-content">
                        <div class="menu-card-header">
                            <h3 class="card-title">${item.name}</h3>
                            <span class="card-price">${item.price}</span>
                        </div>
                        <p class="card-description">${item.description}</p>
                    </div>
                `;
                menuGrid.appendChild(card);
            });
        };

        const loadMeals = async () => {
            menuGrid.innerHTML = '<p class="info-message">Loading menu...</p>';
            try {
                const { data, error } = await supabaseClient.from('meals').select('*').order('category').order('id');
                if (error) throw error;
                allMeals = data;
                displayMenuItems(allMeals);
                const initialActiveFilter = document.querySelector('.menu-filters button[data-category="All"]');
                if(initialActiveFilter) initialActiveFilter.classList.add('active-filter');
            } catch (error) {
                console.error("Error fetching menu:", error);
                menuGrid.innerHTML = `<p class="error-message">Could not load the menu. Please try again later.</p>`;
            }
        };

        menuFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                const currentActive = document.querySelector('.menu-filters button.active-filter');
                if (currentActive) currentActive.classList.remove('active-filter');
                e.target.classList.add('active-filter');
                const category = e.target.dataset.category;
                const filteredItems = category === 'All' ? allMeals : allMeals.filter(item => item.category === category);
                displayMenuItems(filteredItems);
            }
        });
        loadMeals();
    }
});