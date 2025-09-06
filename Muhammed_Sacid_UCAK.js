(() => {
    'use strict';
    
    // Configuration object for better maintainability
    const CONFIG = {
        API_URL: 'https://gist.githubusercontent.com/sevindi/8bcbde9f02c1d4abe112809c974e1f49/raw/9bf93b58df623a9b16f1db721cd0a7a539296cf0/products.json',
        CAROUSEL_TITLE: 'Beğenebileceğinizi düşündüklerimiz',
        STORAGE_KEYS: {
            PRODUCTS: 'carousel_products_data',
            FAVORITES: 'user_favorite_items',
            LAST_FETCH: 'last_data_fetch_time'
        },
        CACHE_DURATION: 3600000, // 1 hour in milliseconds
        ITEMS_PER_VIEW: {
            DESKTOP: 5,
            TABLET: 3,
            MOBILE: 2
        }
    };

    // Main carousel module
    const ProductCarousel = {
        state: {
            products: [],
            favorites: new Set(),
            currentIndex: 0,
            itemsPerView: CONFIG.ITEMS_PER_VIEW.DESKTOP,
            isInitialized: false
        },
        // Initialize the carousel
        async init() {
            try {
                if (!this.isHomePage()) {
                    console.log('wrong page');
                    return;
                }

                if (this.state.isInitialized) return;
                this.state.isInitialized = true;
                
            } catch (error) {
                console.error('Carousel initialization failed:', error);
            }
        },

        // Check if current page is homepage
        isHomePage() {
            const path = window.location.pathname;
            return path === '/' || path === '/index.html' || path === '';
        },  
        // Fetch products from API
        async fetchProducts() {
            try {
                const response = await fetch(CONFIG.API_URL);
                if (!response.ok) throw new Error('Network response was not ok');
                
                const data = await response.json();
                this.state.products = data;
                
                // Cache the products
                localStorage.setItem(CONFIG.STORAGE_KEYS.PRODUCTS, JSON.stringify(data));
                localStorage.setItem(CONFIG.STORAGE_KEYS.LAST_FETCH, Date.now().toString());
                
                console.log('Products fetched from API');
            } catch (error) {
                console.error('Failed to fetch products:', error);
                // Try to use cached data even if expired
                const cached = this.getCachedProducts();
                if (cached) {
                    this.state.products = cached;
                }
            }
        },
                // Get cached products from localStorage
        getCachedProducts() {
            try {
                const cached = localStorage.getItem(CONFIG.STORAGE_KEYS.PRODUCTS);
                return cached ? JSON.parse(cached) : null;
            } catch (error) {
                console.error('Failed to parse cached products:', error);
                return null;
            }
        },

        // Check if cache is still valid
        isCacheValid() {
            const lastFetch = localStorage.getItem(CONFIG.STORAGE_KEYS.LAST_FETCH);
            if (!lastFetch) return false;
            
            const timeDiff = Date.now() - parseInt(lastFetch, 10);
            return timeDiff < CONFIG.CACHE_DURATION;
        },
       // Save favorites to localStorage
        saveFavorites() {
            try {
                const favoritesArray = Array.from(this.state.favorites);
                localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(favoritesArray));
            } catch (error) {
                console.error('Failed to save favorites:', error);
            }
        },
        // Load favorites from localStorage
        loadFavorites() {
            try {
                const stored = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
                if (stored) {
                    const favorites = JSON.parse(stored);
                    this.state.favorites = new Set(favorites);
                }
            } catch (error) {
                console.error('Failed to load favorites:', error);
            }
        },
        // Toggle favorite status
        toggleFavorite(productId) {
            if (this.state.favorites.has(productId)) {
                this.state.favorites.delete(productId);
            } else {
                this.state.favorites.add(productId);
            }
            this.saveFavorites();
            this.updateFavoriteIcon(productId);
        },
        // Update favorite icon appearance
        updateFavoriteIcon(productId) {
            const icon = document.querySelector(`[data-favorite-id="${productId}"]`);
            if (icon) {
                if (this.state.favorites.has(productId)) {
                    icon.classList.add('active');
                } else {
                    icon.classList.remove('active');
                }
            }
        },
        // Calculate discount percentage -> you can show in the Page (will chose color as orange)
        calculateDiscount(price, originalPrice) {
            if (price >= originalPrice) return 0;
            return Math.round(((originalPrice - price) / originalPrice) * 100);
        },

        // Format price for display
        formatPrice(price) {
            return price.toFixed(2).replace('.', ',') + ' TL';
        },

        // Create product card HTML
        createProductCard(product) {
            const discount = this.calculateDiscount(product.price, product.original_price);
            const isFavorite = this.state.favorites.has(product.id);
            
            const card = document.createElement('div');
            card.className = 'carousel-item';
            card.innerHTML = `
                <div class="product-card">
                    <div class="product-image-wrapper">
                        <img src="${product.img}" alt="${product.name}" loading="lazy">
                        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                                data-favorite-id="${product.id}"
                                aria-label="Add to favorites">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="product-info">
                        <div class="product-brand">${product.brand}</div>
                        <div class="product-name" title="${product.name}">${product.name}</div>
                        <div class="product-price-wrapper">
                            ${discount > 0 ? `
                                <div class="price-container">
                                    <span class="original-price">${this.formatPrice(product.original_price)}</span>
                                    <span class="discount-badge">%${discount}</span>
                                </div>
                                <div class="current-price">${this.formatPrice(product.price)}</div>
                            ` : `
                                <div class="current-price">${this.formatPrice(product.price)}</div>
                            `}
                        </div>
                        <button class="add-to-cart-btn" data-product-id="${product.id}">
                            Sepete Ekle
                        </button>
                    </div>
                </div>
            `;
            
            // Add click handler for product -> important
            const productCard = card.querySelector('.product-card');
            productCard.addEventListener('click', (e) => {
                // Prevent navigation when clicking buttons
                if (e.target.closest('.favorite-btn') || e.target.closest('.add-to-cart-btn')) {
                    return;
                }
                window.open(product.url, '_blank');
            });
            
            return card;
        }, 
        
        // Render the carousel
        renderCarousel() {
            // Remove existing carousel if any
            const existing = document.querySelector('.product-carousel-container');
            if (existing) existing.remove();
            
            // Create carousel container
            const container = document.createElement('div');
            container.className = 'product-carousel-container';
            
            // Create carousel wrapper
            const wrapper = document.createElement('div');
            wrapper.className = 'carousel-wrapper';
            
            // Add title
            const title = document.createElement('h2');
            title.className = 'carousel-title';
            title.textContent = CONFIG.CAROUSEL_TITLE;
            wrapper.appendChild(title);
            
            // Create carousel content
            const carouselContent = document.createElement('div');
            carouselContent.className = 'carousel-content';
            
            // Create navigation buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'carousel-nav carousel-nav-prev';
            prevBtn.innerHTML = '‹';
            prevBtn.setAttribute('aria-label', 'Previous items');
            
            const nextBtn = document.createElement('button');
            nextBtn.className = 'carousel-nav carousel-nav-next';
            nextBtn.innerHTML = '›';
            nextBtn.setAttribute('aria-label', 'Next items');
            
            // Create carousel track
            const track = document.createElement('div');
            track.className = 'carousel-track';
            
            // Add products to track
            this.state.products.forEach(product => {
                track.appendChild(this.createProductCard(product));
            });
            
            // Assemble carousel
            carouselContent.appendChild(prevBtn);
            carouselContent.appendChild(track);
            carouselContent.appendChild(nextBtn);
            wrapper.appendChild(carouselContent);
            container.appendChild(wrapper);
            
            // Find insertion point (after hero banner)
            const heroBanner = document.querySelector('.hero-banner, .homepage-slider, [class*="slider"], [class*="banner"]');
            if (heroBanner && heroBanner.parentNode) {
                heroBanner.parentNode.insertBefore(container, heroBanner.nextSibling);
            } else {
                // Fallback: insert at the beginning of main content
                const main = document.querySelector('main, .main-content, #content, body');
                main.insertBefore(container, main.firstChild);
            }
            
            this.updateNavigation();
        },
        
        // Handle carousel navigation
        navigate(direction) {
            const maxIndex = Math.max(0, this.state.products.length - this.state.itemsPerView);
            
            if (direction === 'next') {
                this.state.currentIndex = Math.min(this.state.currentIndex + 1, maxIndex);
            } else {
                this.state.currentIndex = Math.max(this.state.currentIndex - 1, 0);
            }
            
            this.updateCarouselPosition();
            this.updateNavigation();
        },

        // Update carousel position
        updateCarouselPosition() {
            const track = document.querySelector('.carousel-track');
            if (!track) return;
            
            const itemWidth = 100 / this.state.itemsPerView;
            const translateX = -(this.state.currentIndex * itemWidth);
            track.style.transform = `translateX(${translateX}%)`;
        },

        // Update navigation buttons state
        updateNavigation() {
            const prevBtn = document.querySelector('.carousel-nav-prev');
            const nextBtn = document.querySelector('.carousel-nav-next');
            const maxIndex = Math.max(0, this.state.products.length - this.state.itemsPerView);
            
            if (prevBtn) {
                prevBtn.disabled = this.state.currentIndex === 0;
            }
            
            if (nextBtn) {
                nextBtn.disabled = this.state.currentIndex >= maxIndex;
            }
        },

             // Handle responsive behavior
        handleResponsive() {
            const updateItemsPerView = () => {
                const width = window.innerWidth;
                let newItemsPerView;
                
                if (width <= 576) {
                    newItemsPerView = CONFIG.ITEMS_PER_VIEW.MOBILE;
                } else if (width <= 992) {
                    newItemsPerView = CONFIG.ITEMS_PER_VIEW.TABLET;
                } else {
                    newItemsPerView = CONFIG.ITEMS_PER_VIEW.DESKTOP;
                }
                
                if (newItemsPerView !== this.state.itemsPerView) {
                    this.state.itemsPerView = newItemsPerView;
                    this.state.currentIndex = 0;
                    this.updateCarouselPosition();
                    this.updateNavigation();
                    
                    // Update CSS variable
                    document.documentElement.style.setProperty('--items-per-view', newItemsPerView);
                }
            };
            
            updateItemsPerView();
            
            let resizeTimer;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimer);
                resizeTimer = setTimeout(updateItemsPerView, 250);
            });
        },

        // Attach event listeners
        attachEventListeners() {
            // Navigation buttons
            document.addEventListener('click', (e) => {
                if (e.target.closest('.carousel-nav-prev')) {
                    this.navigate('prev');
                } else if (e.target.closest('.carousel-nav-next')) {
                    this.navigate('next');
                } else if (e.target.closest('.favorite-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.target.closest('.favorite-btn');
                    const productId = parseInt(btn.dataset.favoriteId, 10);
                    this.toggleFavorite(productId);
                } else if (e.target.closest('.add-to-cart-btn')) {
                    e.preventDefault();
                    e.stopPropagation();
                    const btn = e.target.closest('.add-to-cart-btn');
                    console.log('Add to cart:', btn.dataset.productId);
                }
            });
            
            // Touch support for mobile
            let touchStartX = 0;
            let touchEndX = 0;
            
            const track = document.querySelector('.carousel-track');
            if (track) {
                track.addEventListener('touchstart', (e) => {
                    touchStartX = e.changedTouches[0].screenX;
                }, { passive: true });
                
                track.addEventListener('touchend', (e) => {
                    touchEndX = e.changedTouches[0].screenX;
                    const diff = touchStartX - touchEndX;
                    
                    if (Math.abs(diff) > 50) {
                        if (diff > 0) {
                            this.navigate('next');
                        } else {
                            this.navigate('prev');
                        }
                    }
                }, { passive: true });
            }
        },
    };
})();









