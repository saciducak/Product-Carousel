# Product Carousel Implementation

A dynamic, responsive product carousel component built with vanilla JavaScript. This solution provides an interactive shopping experience with favorites management and intelligent caching.

## ✨ Features

### Core Functionality
- **Dynamic Product Display**: Fetches and displays products in an interactive carousel format
- **Responsive Design**: Automatically adjusts to different screen sizes
  - Desktop: 5 products per view
  - Tablet: 3 products per view
  - Mobile: 2 products per view
- **Smart Caching**: Stores product data locally for improved performance
- **Favorites System**: Users can mark products as favorites with persistent storage
- **Touch Support**: Swipe gestures for mobile navigation

### Technical Highlights
- ✅ Pure JavaScript implementation (no external dependencies)
- ✅ Single file solution
- ✅ Homepage detection
- ✅ LocalStorage integration
- ✅ API data fetching with fallback
- ✅ Cross-browser compatible
- ✅ Accessibility support (ARIA labels)

## 📋 Requirements Compliance

| Requirement | Status | Implementation |
|------------|--------|---------------|
| Fetch products from API | ✅ | Async fetch with error handling |
| Title: "Beğenebileceğinizi düşündüklerimiz" | ✅ | Displayed as carousel header |
| Homepage only execution | ✅ | Path detection with console warning |
| Product click → new tab | ✅ | Opens product URL in new window |
| Price discount display | ✅ | Shows original price, current price, and percentage |
| Favorite toggle | ✅ | Heart icon with orange fill state |
| LocalStorage caching | ✅ | Products cached for 1 hour |
| Persistent favorites | ✅ | Favorites saved across sessions |
| Responsive design | ✅ | Adapts to all screen sizes |
| Vanilla JavaScript only | ✅ | No frameworks or libraries used |
| Single file | ✅ | Complete solution in one .js file |

## 🏗️ Architecture

## Project Structure
```
ProductCarousel/
├── Configuration
│   ├── API endpoint
│   ├── Storage keys
│   └── Display settings
├── State Management
│   ├── Products array
│   ├── Favorites set
│   └── Navigation index
├── Data Layer
│   ├── API fetching
│   ├── Cache validation
│   └── LocalStorage operations
├── UI Components
│   ├── Product cards
│   ├── Navigation controls
│   └── Responsive layout
└── Event Handlers
    ├── Click events
    ├── Touch gestures
    └── Window resize
```

### Data Flow
1. **Initial Load**: Check homepage → Load favorites → Fetch/retrieve products → Render carousel
2. **User Interaction**: Click/Touch → Update state → Save to storage → Update UI
3. **Cache Strategy**: Check cache age → Use if valid → Fetch if expired → Update storage

## 🎨 UI Components

### Product Card
- Product image with lazy loading
- Brand name and product title
- Price display (with discount if applicable)
- Favorite button (heart icon)
- Add to cart button

## 🔧 Configuration

Key settings can be adjusted in the CONFIG object:

```javascript
const CONFIG = {
  API_URL: 'your-api-endpoint',
  CAROUSEL_TITLE: 'Your title',
  CACHE_DURATION: 3600000, // 1 hour
  ITEMS_PER_VIEW: {
    DESKTOP: 5,
    TABLET: 3,
    MOBILE: 2
  }
}
```

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security

- No eval() usage
- XSS prevention through safe DOM manipulation
- Sanitized user inputs
- Secure JSON parsing with error handling

## 📈 Future Enhancements

Potential improvements for future versions:
- Keyboard navigation support
- Infinite scroll option
- Multiple carousel instances
- Analytics integration
- A/B testing support
- Preload next items

## 🤝 Contributing

This project follows clean code principles:
- Modular architecture
- Clear naming conventions
- Comprehensive error handling
- Performance optimized
- Well-documented code

## 👨‍💻 Reference

   # https://baymard.com/blog/carousel-usability
   E-ticaret carousel UX araştırmaları için inceledim 

   # https://css-tricks.com/snippets/css/a-guide-to-flexbox/
   Responsive layout için flexbox kullanımı için 

   # https://developers.google.com/web/fundamentals/performance
   # Stackoverflow 

---

**Note**: This carousel implementation is designed to work seamlessly with e-commerce platforms and can be easily integrated into existing websites without any dependencies.
