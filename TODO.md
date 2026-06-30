# TODO - Verlanglijstje v3

## Setup & Infrastructure

- [ ] Initialize npm project
  - [ ] Create package.json with dependencies
  - [ ] Install Express.js, mysql2, jsonwebtoken, bcrypt, dotenv, nodemailer
  - [ ] Install dev dependencies: nodemon, eslint
- [ ] Create directory structure
  - [ ] server/ directory with subdirectories
  - [ ] public/ directory with subdirectories
  - [ ] Create all base files
- [ ] Environment configuration
  - [ ] Create .env.example
  - [ ] Create .gitignore
  - [ ] Setup database connection configuration

## Backend Development

### Database Layer
- [ ] Create database connection module (server/config/database.js)
  - [ ] Connection pool setup
  - [ ] Error handling
  - [ ] Query helper functions
- [ ] Verify existing database schema compatibility
  - [ ] Test connection to existing database
  - [ ] Validate table structures

### Authentication System
- [ ] Implement auth controller (server/controllers/authController.js)
  - [ ] Register endpoint with validation
  - [ ] Login endpoint with JWT generation
  - [ ] Logout functionality
  - [ ] Password reset request
  - [ ] Password reset confirmation
- [ ] Create auth middleware (server/middleware/auth.js)
  - [ ] JWT verification
  - [ ] Token expiration handling
  - [ ] User session loading
- [ ] Create validation middleware (server/middleware/validation.js)
  - [ ] Email validation
  - [ ] Password strength requirements
  - [ ] Input sanitization
- [ ] Setup auth routes (server/routes/auth.js)

### User Management
- [ ] Implement user controller (server/controllers/userController.js)
  - [ ] Get user profile
  - [ ] Update user profile
  - [ ] Update password
  - [ ] Account settings
  - [ ] **"Forget About Me" - GDPR Data Deletion**
    - [ ] Create endpoint to delete all user data
    - [ ] Delete user's lists
    - [ ] Delete user's items
    - [ ] Remove user from followers of other lists
    - [ ] Delete user's reservations/donations
    - [ ] Delete user account
    - [ ] Send confirmation email
    - [ ] Add confirmation dialog with warning
    - [ ] Implement 30-day grace period option
- [ ] Create user routes

### List Management
- [ ] Implement list controller (server/controllers/listController.js)
  - [ ] Get all lists (own + followed)
  - [ ] Get single list details
  - [ ] Create new list
  - [ ] Update list
  - [ ] Delete list
  - [ ] Follow list
  - [ ] Unfollow list
  - [ ] Share list via email
- [ ] Create list routes (server/routes/lists.js)

### Item Management
- [ ] Implement item controller (server/controllers/itemController.js)
  - [ ] Get items for a list
  - [ ] Create item
  - [ ] Update item
  - [ ] Delete item
  - [ ] Reserve item
  - [ ] Mark item as donated
  - [ ] Take back reservation/donation
- [ ] Create item routes (server/routes/items.js)

### Search & Discovery
- [ ] Implement search functionality
  - [ ] Search users by name/username
  - [ ] Search lists by name
  - [ ] Combined search results
  - [ ] Public vs private list filtering

### Public Sharing
- [ ] Implement share controller (server/controllers/shareController.js)
  - [ ] Encode/decode share IDs (match Java algorithm)
  - [ ] Public list view endpoint
  - [ ] Item donation from public view
- [ ] Create share routes (server/routes/share.js)

### Utilities
- [ ] Email utilities (server/utils/email.js)
  - [ ] Send welcome email
  - [ ] Send password reset email
  - [ ] Send share notification email
  - [ ] Email templates (HTML)
- [ ] Helper functions (server/utils/helpers.js)
  - [ ] Date formatting
  - [ ] String utilities
  - [ ] Validation helpers

### Main Server
- [ ] Create server.js
  - [ ] Express app setup
  - [ ] Middleware configuration (cors, json, static files)
  - [ ] Route registration
  - [ ] Error handling middleware
  - [ ] 404 handling
  - [ ] Server startup

## Frontend Development

### HTML Structure
- [ ] Create index.html
  - [ ] Meta tags for mobile responsiveness
  - [ ] Semantic HTML5 structure
  - [ ] Main app container
  - [ ] Loading state
  - [ ] Template containers for dynamic content

### CSS Styling
- [ ] Main stylesheet (public/css/main.css)
  - [ ] CSS variables for theme colors
  - [ ] Reset/normalize styles
  - [ ] Typography
  - [ ] Layout utilities
  - [ ] Grid system
- [ ] Component styles (public/css/components.css)
  - [ ] Cards
  - [ ] Buttons
  - [ ] Forms
  - [ ] Modals
  - [ ] Notifications/toasts
  - [ ] Navigation
  - [ ] Sidebar
  - [ ] Empty states
  - [ ] Loading states
- [ ] Mobile styles (public/css/mobile.css)
  - [ ] Mobile navigation (hamburger menu)
  - [ ] Touch-friendly interactions
  - [ ] Responsive breakpoints
  - [ ] Mobile-specific layouts

### JavaScript - Core
- [ ] API client (public/js/api.js)
  - [ ] Fetch wrapper with error handling
  - [ ] JWT token management
  - [ ] Request/response interceptors
  - [ ] API endpoint constants
- [ ] Main app (public/js/app.js)
  - [ ] SPA routing (hash-based or history API)
  - [ ] Page initialization
  - [ ] Navigation handling
  - [ ] Global state management
  - [ ] Toast notifications
  - [ ] Modal management
  - [ ] Responsive layout handling

### JavaScript - Authentication
- [ ] Auth module (public/js/auth.js)
  - [ ] Login form handling
  - [ ] Register form handling
  - [ ] Forgot password form
  - [ ] Token storage (localStorage)
  - [ ] Auto-login on page load
  - [ ] Logout functionality
  - [ ] Session expiry handling

### JavaScript - Lists
- [ ] List management (public/js/lists.js)
  - [ ] Display user's lists in sidebar
  - [ ] Display followed lists in sidebar
  - [ ] Create list modal/form
  - [ ] Edit list modal/form
  - [ ] Delete list confirmation
  - [ ] Follow/unfollow buttons
  - [ ] Share list modal with email input
  - [ ] List search/filter

### JavaScript - Items
- [ ] Item management (public/js/items.js)
  - [ ] Display items for selected list
  - [ ] Add item form/modal
  - [ ] Edit item form/modal
  - [ ] Delete item confirmation
  - [ ] Reserve item action
  - [ ] Donate item action
  - [ ] Take back action
  - [ ] Priority sorting
  - [ ] Show/hide donated items
  - [ ] Item details view

### Pages/Views

#### Login/Register Page
- [ ] Login form
  - [ ] Username input
  - [ ] Password input
  - [ ] Remember me checkbox
  - [ ] Submit button
  - [ ] Error messaging
- [ ] Register form
  - [ ] Username input with availability check
  - [ ] Password input with strength indicator
  - [ ] Name input
  - [ ] Email input
  - [ ] Submit button
  - [ ] Validation feedback
- [ ] Forgot password form
  - [ ] Email input
  - [ ] Submit button
  - [ ] Success/error messaging
- [ ] Tab/toggle between forms
- [ ] Responsive mobile layout

#### Main Application Page (Logged In)
- [ ] Top navigation bar
  - [ ] Logo
  - [ ] Search bar
  - [ ] User menu dropdown
  - [ ] Logout button
  - [ ] Mobile hamburger menu
- [ ] Left sidebar (desktop) / Collapsible menu (mobile)
  - [ ] "My Lists" section
    - [ ] List of user's lists with item counts
    - [ ] Add new list button
    - [ ] Edit/delete icons for each list
  - [ ] "Following" section
    - [ ] Followed lists grouped by user
    - [ ] Unfollow option
  - [ ] Search section
    - [ ] Search input
    - [ ] Search results dropdown
- [ ] Main content area
  - [ ] List view
    - [ ] List header with name, privacy toggle
    - [ ] Share button
    - [ ] Edit list button
    - [ ] Item list/grid
    - [ ] Add item button
    - [ ] Empty state when no items
  - [ ] Item cards/rows
    - [ ] Item name (clickable for details)
    - [ ] Description preview
    - [ ] URL link
    - [ ] Price
    - [ ] Priority indicator
    - [ ] Status (available, reserved, donated)
    - [ ] Edit/delete buttons (if own list)
    - [ ] Reserve/donate buttons (if following)
    - [ ] Show-from date indicator

#### Search Results Page
- [ ] Search query display
- [ ] Results grouped by type (users, lists)
- [ ] User cards with follow button
- [ ] List cards with owner name and follow button
- [ ] Empty state for no results

#### Public Share Page
- [ ] List name and owner
- [ ] Read-only item list
- [ ] Donate button for items
- [ ] Donation confirmation with optional name/comment
- [ ] No authentication required
- [ ] Responsive layout

### Modals/Dialogs
- [ ] Add/Edit List Modal
  - [ ] List name input
  - [ ] Public/private toggle
  - [ ] Save/cancel buttons
- [ ] Add/Edit Item Modal
  - [ ] Item name input
  - [ ] URL input
  - [ ] Description textarea
  - [ ] Price input
  - [ ] Priority selector (1-100)
  - [ ] Show-from date picker
  - [ ] Save/cancel buttons
- [ ] Share List Modal
  - [ ] Email input (multiple)
  - [ ] Optional message
  - [ ] Share link display (copy button)
  - [ ] Send/cancel buttons
- [ ] Delete Confirmation Modal
  - [ ] Warning message
  - [ ] Confirm/cancel buttons
- [ ] Donation Modal (public share)
  - [ ] Optional name input
  - [ ] Optional comment
  - [ ] Confirm/cancel buttons

## Testing

### Backend Testing
- [ ] Test database connection
- [ ] Test authentication endpoints
  - [ ] Register with valid/invalid data
  - [ ] Login with correct/incorrect credentials
  - [ ] JWT token validation
  - [ ] Password reset flow
- [ ] Test list endpoints
  - [ ] CRUD operations
  - [ ] Follow/unfollow
  - [ ] Permission checks (own vs others' lists)
- [ ] Test item endpoints
  - [ ] CRUD operations
  - [ ] Status changes
  - [ ] Permission checks
- [ ] Test search functionality
- [ ] Test share endpoints
  - [ ] ID encoding/decoding
  - [ ] Public access

### Frontend Testing
- [ ] Test responsive layouts (mobile, tablet, desktop)
- [ ] Test all forms with validation
- [ ] Test API error handling
- [ ] Test navigation and routing
- [ ] Test authentication flow
- [ ] Test list/item operations
- [ ] Cross-browser testing

## Deployment Preparation

- [ ] Production environment setup
  - [ ] Environment variables configuration
  - [ ] Database connection pooling optimization
  - [ ] HTTPS configuration
- [ ] Performance optimization
  - [ ] Minify CSS/JS
  - [ ] Enable gzip compression
  - [ ] Image optimization
  - [ ] Add caching headers
- [ ] Security hardening
  - [ ] Rate limiting implementation
  - [ ] CORS configuration
  - [ ] Security headers (helmet.js)
  - [ ] SQL injection prevention audit
  - [ ] XSS prevention audit
- [ ] Documentation
  - [ ] API documentation
  - [ ] Deployment guide
  - [ ] Environment setup guide
- [ ] Monitoring setup
  - [ ] Error logging
  - [ ] Performance monitoring
  - [ ] Uptime monitoring

## Migration from verlang2

- [ ] Verify password hash compatibility
  - [ ] Test login with existing users
  - [ ] Migration script if needed
- [ ] Verify share ID encoding matches Java implementation
- [ ] Data integrity check
  - [ ] Verify all lists are accessible
  - [ ] Verify all items display correctly
  - [ ] Verify follows are intact
- [ ] Parallel deployment testing
  - [ ] Run v3 alongside v2 temporarily
  - [ ] Compare functionality
  - [ ] User acceptance testing

## Documentation

- [ ] Update README.md with final details
- [ ] Create API documentation
- [ ] Create user guide
- [ ] Document deployment process
- [ ] Document backup procedures

## Future Enhancements (Post-Launch)

- [ ] PWA support (offline access, add to home screen)
- [ ] Push notifications
- [ ] Image uploads for items
- [ ] Rich text editor for descriptions
- [ ] Import/export lists
- [ ] List templates
- [ ] Activity feed
- [ ] Email digests
- [ ] Social sharing (Facebook, Twitter)
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Accessibility improvements (ARIA, keyboard navigation)
- [ ] Admin panel
- [ ] Analytics dashboard
