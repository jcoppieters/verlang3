# Quick Start Guide - Verlanglijstje v3

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **MySQL** (v5.5 or higher) - with existing verlang database

## Initial Setup

### 1. Clone/Navigate to Project Directory

```bash
cd /Users/johan/Development/verlanglijstje/verlang3
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- Express.js (web framework)
- MySQL2 (database driver)
- JWT (authentication)
- bcrypt (password hashing)
- nodemailer (email sending)
- And more...

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your actual configuration:

```env
# Database Configuration (use existing verlang database)
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=verlang
DB_PORT=3306

# JWT Secret (generate a random string)
JWT_SECRET=use_a_long_random_secret_here
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM=noreply@verlanglijstje.be
SMTP_FROM_NAME=Verlanglijstje.be

# Server
PORT=3000
NODE_ENV=development
APP_URL=http://localhost:3000
```

**Important Notes:**
- The database name should be `verlang` (existing database)
- Generate a secure JWT secret (you can use: `openssl rand -base64 32`)
- For Gmail, you need to use an App Password, not your regular password

### 4. Verify Database Connection

The application will use the existing MySQL database. Make sure you can connect to it:

```bash
mysql -u your_mysql_user -p verlang
```

Then verify the tables exist:

```sql
SHOW TABLES;
-- Should show: users, lists, items, follows
```

## Running the Application

### Development Mode (with auto-restart)

```bash
npm run dev
```

This uses nodemon to automatically restart the server when you make changes.

### Production Mode

```bash
npm start
```

### Accessing the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Project Structure Overview

```
verlang3/
├── server/                 # Backend code
│   ├── config/            # Database configuration
│   ├── controllers/       # Request handlers
│   ├── middleware/        # Authentication, validation
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── server.js          # Main entry point
│
├── public/                # Frontend code (static files)
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript
│   ├── images/           # Images
│   └── index.html        # Main HTML file
│
├── .env                   # Environment variables (create this)
├── .env.example          # Environment template
├── .gitignore            # Git ignore rules
├── package.json          # Project dependencies
├── README.md             # Main documentation
├── TODO.md               # Development tasks
├── API.md                # API documentation
└── PAGES.md              # Page/UI documentation
```

## Development Workflow

### 1. Start with Backend

Create the backend infrastructure first:

```bash
# Create directory structure
mkdir -p server/{config,controllers,middleware,routes,utils}
mkdir -p public/{css,js,images}
```

### 2. Implement Core Features

Follow the TODO.md checklist:
1. Database connection
2. Authentication system
3. List management
4. Item management
5. Search & share features

### 3. Build Frontend

After backend APIs are working:
1. Create HTML structure
2. Style with CSS
3. Implement JavaScript for API calls
4. Add interactivity and UX polish

### 4. Test Thoroughly

- Test all API endpoints with tools like Postman
- Test frontend with different browsers
- Test responsive design on mobile devices
- Test with existing database data

## Common Development Tasks

### Adding a New API Endpoint

1. Create/update controller in `server/controllers/`
2. Create/update route in `server/routes/`
3. Register route in `server/server.js`
4. Document in `API.md`

### Adding a New Page/View

1. Update `public/index.html` with new content areas
2. Add styles in `public/css/`
3. Add JavaScript logic in `public/js/`
4. Update routing in `public/js/app.js`

### Database Queries

Use the mysql2 promise API:

```javascript
const db = require('./config/database');

async function getUser(id) {
  const [rows] = await db.query(
    'SELECT * FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
}
```

## Testing the Application

### Manual Testing Checklist

- [ ] Register a new user
- [ ] Login with existing user
- [ ] Create a new list
- [ ] Add items to list
- [ ] Edit list and items
- [ ] Delete items and lists
- [ ] Search for users/lists
- [ ] Follow another user's list
- [ ] Share a list via email
- [ ] Access public share link
- [ ] Mark item as donated from public link
- [ ] Reserve/donate items when following
- [ ] Logout

### Using the Existing Database

The beauty of this rebuild is that it uses the existing database, so:
- All existing users can log in
- All existing lists are preserved
- All existing items remain intact
- All follows are maintained

**Important:** Before making any changes, create a database backup:

```bash
mysqldump -u your_user -p verlang > verlang_backup_$(date +%Y%m%d).sql
```

## Debugging

### Enable Debug Logging

The server will log important information to the console when running in development mode.

### Database Connection Issues

If you can't connect to the database:
1. Check `.env` file settings
2. Verify MySQL is running: `mysql.server status` (macOS)
3. Test connection manually: `mysql -u user -p verlang`
4. Check MySQL user permissions

### Port Already in Use

If port 3000 is already in use:
1. Change `PORT` in `.env` to another port (e.g., 3001)
2. Or find and kill the process using port 3000

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## Next Steps

1. Read through `TODO.md` for detailed implementation tasks
2. Review `API.md` to understand the API structure
3. Check `PAGES.md` for UI/UX specifications
4. Start implementing features one by one
5. Test frequently with the existing database

## Deployment

When ready to deploy:

1. Set `NODE_ENV=production` in `.env`
2. Update `APP_URL` to production domain
3. Set up HTTPS/SSL certificate
4. Configure database connection for production server
5. Set up process manager (PM2 recommended):

```bash
npm install -g pm2
pm2 start server/server.js --name verlanglijstje
pm2 save
pm2 startup
```

## Getting Help

- Check `README.md` for comprehensive documentation
- Review `API.md` for API endpoint details
- Consult `PAGES.md` for UI specifications
- See `TODO.md` for implementation checklist

## Important Reminders

⚠️ **Database:** This project uses the existing verlang database. Always backup before making changes!

⚠️ **Passwords:** Verify that the password hashing is compatible with existing users (they use the Java bcrypt implementation)

⚠️ **Share IDs:** The share ID encoding must match the Java algorithm exactly:
- Encode: `((id * 97) + 17) * 97 + 19`
- Decode: `(((id - 19) / 97) - 17) / 97`

✅ **No Migration:** One of the goals is to use the database as-is, so no schema changes or data migrations!

---

Good luck with the rebuild! 🚀
