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
        }
    };
})();





