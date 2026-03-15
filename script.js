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
    const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
    
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

    if (document.body.classList.contains('menu-page')) {
        const menuGrid = document.getElementById('menu-grid');
        const menuFilters = document.getElementById('menu-filters');
        
        if (!menuGrid || !menuFilters) return;

        // Hardcoded data replacing Supabase
        let allMeals = [
            { id: 1, category: 'Appetizers', name: 'Calamari', price: '$14.00', description: 'Crispy fried squid rings with marinara dipping sauce.', image: 'https://www.seriouseats.com/thmb/RLHQFr_lp9-HTIWBikzVwu4M17s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/__opt__aboutcom__coeus__resources__content_migration__serious_eats__seriouseats.com__2020__11__20201125-fried-calamari-vicky-wasik-10-9cee3a081e96476b89e29b331d30be61.jpg' },
            { id: 2, category: 'Appetizers', name: 'Bruschetta', price: '$10.00', description: 'Toasted baguette with fresh tomatoes, basil, and garlic.', image: 'https://www.thecookingtwins.com/wp-content/uploads/2025/09/tomato-basil-garlic-bread-featured.webp' },
            { id: 3, category: 'Mains', name: 'Grilled Salmon', price: '$28.00', description: 'Fresh caught salmon with roasted asparagus and lemon butter.', image: 'https://cld.accentuate.io/560610476200/1688998268095/GP_Premiere_CountertopAirFryOven_AirFryerBasket_Overhead_SalmonRecipe_04-(1).jpg?v=1688998268095&options=w_870,h_700' },
            { id: 4, category: 'Mains', name: 'Ribeye Steak', price: '$35.00', description: '12oz prime ribeye with garlic mashed potatoes.', image: 'https://preview.redd.it/prime-rib-w-au-jus-and-whipped-garlic-mashed-potato-v0-0k5fm0wzz8qa1.jpg?width=640&crop=smart&auto=webp&s=0fc4a3993a2df3316a366a8ddea28c87457b8cd8' },
            { id: 5, category: 'Desserts', name: 'Tiramisu', price: '$9.00', description: 'Classic Italian dessert with espresso-soaked ladyfingers.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVcjuc8qfiG1FTNked587JRoKi3HjCsNETMA&s' },
            { id: 6, category: 'Beverages', name: 'Artisan Lemonade', price: '$5.00', description: 'House-made lemonade with a sprig of mint.', image: 'https://www.giverecipe.com/wp-content/uploads/2018/07/Mint-Lemonade-2.jpg' }
        ];

        const fallbackImage = 'https://via.placeholder.com/150x150.png/1a1a1a/888888?text=No+Image';

        const displayMenuItems = (items) => {
            menuGrid.innerHTML = '';
            if (items.length === 0) {
                menuGrid.innerHTML = '<p class="info-message">No items for this category.</p>';
                return;
            }
            items.forEach(item => {
                const card = document.createElement('div');
                card.className = 'menu-card';
                card.innerHTML = `
                    <img src="${item.image || fallbackImage}" alt="${item.name}" class="card-img" loading="lazy" onerror="this.onerror=null; this.src='${fallbackImage}';">
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

        const loadMeals = () => {
            // Immediately display the hardcoded data instead of fetching
            displayMenuItems(allMeals);
            const initialActiveFilter = document.querySelector('.menu-filters button[data-category="All"]');
            if(initialActiveFilter) initialActiveFilter.classList.add('active-filter');
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
}

document.addEventListener('DOMContentLoaded', initializePage);