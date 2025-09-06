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
                
                console.log('Products fetched from API');
            } catch (error) {
                console.error('Failed to fetch products:', error);
            }
        }
    };
})();


