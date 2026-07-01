# TODO - Verlanglijstje v3

## Setup & Infrastructure

- [X] Initialize npm project
  - [X] Create package.json with dependencies
  - [X] Install Express.js, mysql2, jsonwebtoken, bcrypt, nodemailer
  - [X] Install dev dependencies: nodemon, eslint, typescript
- [X] Create directory structure
  - [X] server/ directory with subdirectories
  - [X] public/ directory with subdirectories
  - [X] Create all base files
- [X] Environment configuration
  - [X] Create TypeScript config system (conf.ts, conf.dev.ts, conf.prod.ts)
  - [X] Create .gitignore
  - [X] Setup database connection configuration

## Backend Development

### Database Layer
- [X] Create database connection module (server/config/database.ts)
  - [X] Connection pool setup
  - [X] Error handling
  - [X] Query helper functions
- [X] Verify existing database schema compatibility
  - [X] Test connection to existing database
  - [X] Validate table structures
  - [X] Database migrations for password columns

### Authentication System
- [X] Implement auth controller (server/controllers/authController.ts)
  - [X] Register endpoint with validation
  - [X] Login endpoint with JWT generation (bcrypt password verification)
  - [X] Logout functionality
  - [X] Password reset request (forgot password)
  - [X] Password reset confirmation
  - [X] Password migration script (plain text → bcrypt)
- [X] Create auth middleware (server/middleware/auth.ts)
  - [X] JWT verification
  - [X] Token expiration handling
  - [X] User session loading
- [X] Create validation middleware (server/middleware/validation.ts)
  - [X] Email validation
  - [X] Password strength requirements
  - [X] Input sanitization
- [X] Setup auth routes (server/routes/auth.ts)
  - [X] POST /auth/register
  - [X] POST /auth/login
  - [X] POST /auth/forgot-password
  - [X] POST /auth/reset-password
  - [X] GET /auth/profile
  - [X] PUT /auth/profile
  - [X] PUT /auth/password

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
- [X] Implement list controller (server/controllers/listController.ts)
  - [X] Get all lists (own + followed)
  - [X] Get single list details
  - [X] Create new list
  - [X] Update list
  - [X] Delete list
  - [X] Follow list
  - [X] Unfollow list
  - [X] Share list via email
- [X] Create list routes (server/routes/lists.ts)

### Item Management
- [X] Implement item controller (server/controllers/itemController.ts)
  - [X] Get items for a list
  - [X] Create item
  - [X] Update item
  - [X] Delete item
  - [X] Reserve item
  - [X] Mark item as donated
  - [X] Take back reservation/donation
  - [X] Reorder items (priority system)
- [X] Create item routes (server/routes/items.ts)

### Search & Discovery
- [X] Implement search functionality
  - [X] Search users by name/username
  - [X] Search lists by name
  - [X] Combined search results
  - [X] Public vs private list filtering

### Public Sharing
- [X] Implement share controller (server/controllers/shareController.ts)
  - [X] Encode/decode share IDs (match Java algorithm)
  - [X] Public list view endpoint
  - [X] Item donation from public view
  - [X] Search for users and lists
- [X] Create share routes (server/routes/share.ts)

### Utilities
- [X] Email utilities (server/utils/email.ts)
  - [X] Send welcome email
  - [X] Send password reset email
  - [X] Send share notification email
  - [X] Email templates (HTML)
- [X] Helper functions (server/utils/helpers.ts)
  - [X] Date formatting
  - [X] String utilities
  - [X] Validation helpers

### Main Server
- [X] Create server.ts
  - [X] Express app setup
  - [X] Middleware configuration (cors, json, static files, helmet, rate limiting)
  - [X] Route registration
  - [X] Error handling middleware
  - [X] 404 handling
  - [X] Server startup

## Frontend Development

### HTML Structure
- [X] Create index.html
  - [X] Meta tags for mobile responsiveness
  - [X] Semantic HTML5 structure
  - [X] Main app container
  - [X] Loading state
  - [X] Template containers for dynamic content
  - [X] Navbar with user icon
  - [X] Hamburger menu for mobile

### CSS Styling
- [X] Main stylesheet (public/css/main.css)
  - [X] CSS variables for theme colors
  - [X] Reset/normalize styles
  - [X] Typography
  - [X] Layout utilities
  - [X] Grid system
  - [X] Component styles (cards, buttons, forms, modals, etc.)
  - [X] Mobile navigation (hamburger menu)
  - [X] Touch-friendly interactions
  - [X] Responsive breakpoints
  - [X] Mobile-specific layouts
  - [X] Drag-and-drop item reordering
  - [X] Empty states
  - [X] Loading states

### JavaScript - Core
- [X] API client (public/js/api.js)
  - [X] Fetch wrapper with error handling
  - [X] JWT token management
  - [X] Request/response interceptors
  - [X] API endpoint constants
- [X] Main app (public/js/app.js)
  - [X] SPA routing (hash-based)
  - [X] Page initialization
  - [X] Navigation handling
  - [X] Global state management
  - [X] Toast notifications
  - [X] Modal management
  - [X] Responsive layout handling
  - [X] Sidebar toggle
  - [X] Navbar updates

### JavaScript - Internationalization
- [X] i18n module (public/js/i18n.js)
  - [X] Multi-language support (NL/FR/EN)
  - [X] Translation loading
  - [X] Language switching
  - [X] t() helper function
- [X] translations.json
  - [X] Complete translations for all UI text
  - [X] Auth page translations
  - [X] List/item translations
  - [X] Modal translations
  - [X] Error messages
  - [X] Success messages

### JavaScript - Authentication
- [X] Auth module (public/js/auth.js)
  - [X] Login form handling
  - [X] Register form handling (fully translated)
  - [ ] Forgot password form (backend ready, frontend TODO)
  - [X] Token storage (localStorage)
  - [X] Auto-login on page load
  - [X] Logout functionality
  - [X] Session expiry handling
  - [X] Profile page
  - [X] Update profile functionality
  - [X] Change password functionality

### JavaScript - Lists
- [X] List management (public/js/lists.js)
  - [X] Display user's lists in sidebar
  - [X] Display followed lists in sidebar
  - [X] Create list modal/form (fully translated)
  - [X] Edit list modal/form (fully translated)
  - [X] Delete list confirmation
  - [X] Follow/unfollow buttons
  - [X] Share list modal with email input
  - [X] Unfollow from list detail page

### JavaScript - Items
- [X] Item management (public/js/items.js)
  - [X] Display items for selected list
  - [X] Add item form/modal (fully translated)
  - [X] Edit item form/modal (fully translated)
  - [X] Delete item confirmation
  - [X] Reserve item action with modal
  - [X] Donate item action with modal
  - [X] Take back action
  - [X] Priority sorting (new items at top)
  - [X] Drag-and-drop reordering (desktop & mobile)
  - [X] Show/hide based on showfrom date
  - [X] Item search functionality
  - [X] URL auto-format (https:// prefix)

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

## install on server

1) this is the current nginx config, what do I need to change? I run the backend server on poort 3007:

```server {
        listen 80;
        listen [::]:80;

        # listen 443;
        # listen [::]:443;

        # ssl_certificate      /etc/nginx/certs/verlang.cert;
        # ssl_certificate_key  /etc/nginx/certs/verlang.key;

        server_name www.verlanglijstje.be verlanglijstje.be verlang.coppieters.be;

        root /var/www/coppieters;

        location / {
                proxy_pass http://verlang.local:8080;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host verlang.local;
                proxy_set_header X-Forwarded-Host $host;
                proxy_set_header X-Forwarded-Server $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        }
}```

2) What do I need to do to get the send email from verlanglijstje.be ?
I have the dns admin and the domain is hosted on combell, so I think we can have smtp server etc...