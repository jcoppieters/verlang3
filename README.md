# Verlanglijstje.be - Version 3

Modern rebuild of verlanglijstje.be with Node.js backend and responsive HTML/CSS frontend.

## Overview

Verlanglijstje.be is a wishlist management platform where users can:
- Create multiple wishlists for different occasions
- Add items with details (name, URL, description, price, priority)
- Share wishlists with friends and family via unique links
- Follow other users' wishlists
- Mark items as reserved or donated
- Search for friends and their lists

## Tech Stack

### Backend
- **Node.js** (v18+) with Express.js
- **MySQL** database (existing schema - no migrations needed)
- **JWT** for authentication
- **bcrypt** for password hashing
- **nodemailer** for email notifications

### Frontend
- **Vanilla JavaScript** (ES6+) for SPA-like behavior
- **Responsive CSS** with mobile-first approach
- **Modern CSS Grid/Flexbox** layouts
- No framework dependencies for faster loading

### Development Tools
- **nodemon** for development
- **dotenv** for environment configuration
- **eslint** for code quality
- **mysql2** for database connections with promise support

## Database Schema

The existing database has the following tables:
- **users**: id, username, password, name, email, since, lastlogin
- **lists**: id, user, name, public, lastupdate
- **items**: id, list, name, url, description, price, priority, givenname, givencomment, givenat, showfrom, status, givenby
- **follows**: user, list

## Project Structure

```
verlang3/
├── server/
│   ├── config/
│   │   └── database.js          # Database connection configuration
│   ├── controllers/
│   │   ├── authController.js    # Login, register, password reset
│   │   ├── userController.js    # User profile, settings
│   │   ├── listController.js    # List CRUD operations
│   │   ├── itemController.js    # Item CRUD operations
│   │   └── shareController.js   # Public sharing functionality
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── validation.js        # Request validation
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── lists.js             # List management routes
│   │   ├── items.js             # Item management routes
│   │   └── share.js             # Public share routes
│   ├── utils/
│   │   ├── email.js             # Email sending utilities
│   │   └── helpers.js           # Common helper functions
│   └── server.js                # Main application entry point
├── public/
│   ├── css/
│   │   ├── main.css             # Main styles
│   │   ├── mobile.css           # Mobile-specific styles
│   │   └── components.css       # Reusable components
│   ├── js/
│   │   ├── app.js               # Main application logic
│   │   ├── api.js               # API client wrapper
│   │   ├── auth.js              # Authentication handling
│   │   ├── lists.js             # List management UI
│   │   └── items.js             # Item management UI
│   ├── images/
│   │   └── logo.png
│   └── index.html               # Single page application entry
├── .env.example                 # Example environment variables
├── .gitignore
├── package.json
└── TODO.md
```

## Environment Variables

Required environment variables (see `.env.example`):
- `DB_HOST`: MySQL host
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_NAME`: Database name
- `JWT_SECRET`: Secret for JWT tokens
- `SMTP_HOST`: Email server host
- `SMTP_USER`: Email username
- `SMTP_PASSWORD`: Email password
- `SMTP_FROM`: From email address
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: development or production

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Start production server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Lists
- `GET /api/lists` - Get user's lists and followed lists
- `GET /api/lists/:id` - Get specific list details
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list
- `POST /api/lists/:id/follow` - Follow a list
- `DELETE /api/lists/:id/follow` - Unfollow a list
- `POST /api/lists/:id/share` - Share list via email

### Items
- `GET /api/lists/:listId/items` - Get all items in a list
- `POST /api/lists/:listId/items` - Add item to list
- `PUT /api/items/:id` - Update item
- `DELETE /api/items/:id` - Delete item
- `POST /api/items/:id/reserve` - Reserve an item
- `POST /api/items/:id/donate` - Mark item as donated
- `POST /api/items/:id/takeback` - Unreserve/undo donation

### Search
- `GET /api/search?q=query` - Search for users and lists

### Public Sharing
- `GET /api/share/:encodedId` - Get public list by encoded ID

## Design Guidelines

### Color Scheme
- Primary: #4A90E2 (blue)
- Secondary: #50C878 (green)
- Accent: #F39C12 (orange)
- Text: #333333
- Background: #F5F7FA
- White: #FFFFFF

### Typography
- Headings: System fonts (San Francisco, Segoe UI, Roboto)
- Body: System fonts
- Sizes: 14px base, responsive scaling

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### UI Components
- Cards for lists and items
- Modal dialogs for add/edit forms
- Toast notifications for feedback
- Loading states and skeletons
- Empty states with helpful messages

## Features

### Phase 1 - Core Functionality
- [x] User authentication (login, register)
- [ ] List management (create, edit, delete)
- [ ] Item management (add, edit, delete)
- [ ] Basic responsive layout

### Phase 2 - Social Features
- [ ] Search for users and lists
- [ ] Follow/unfollow lists
- [ ] Share lists via email
- [ ] Public share links

### Phase 3 - Advanced Features
- [ ] Item reservation system
- [ ] Item donation tracking
- [ ] Priority sorting
- [ ] Show-from dates for items
- [ ] Rich text descriptions
- [ ] Image uploads for items

### Phase 4 - Polish
- [ ] Email notifications
- [ ] User profiles
- [ ] Settings page
- [ ] Performance optimization
- [ ] PWA support for mobile

## Migration Notes

### From verlang2 (Java)
- Database schema remains unchanged
- Passwords are hashed (verify bcrypt compatibility)
- Share ID encoding algorithm must match: `((id * 97) + 17) * 97 + 19`
- Session management: Java sessions → JWT tokens
- JSP views → Single Page Application

## Security Considerations

- JWT tokens with expiration
- HTTPS only in production
- SQL injection protection via parameterized queries
- XSS protection via content sanitization
- CSRF protection for state-changing operations
- Rate limiting on authentication endpoints
- Input validation on all endpoints

## Performance

- Gzip compression for static assets
- CDN for images (future enhancement)
- Database connection pooling
- Client-side caching with localStorage
- Lazy loading for images
- Minified CSS/JS in production

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)
- Mobile Safari (iOS 12+)
- Chrome Mobile (Android 8+)

## License

Private project - All rights reserved
