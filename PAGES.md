# Pages Overview - Verlanglijstje v3

## Application Structure

The application follows a Single Page Application (SPA) pattern with dynamic content loading based on authentication state and user actions.

---

## Pages & Views

### 1. **Landing / Login Page** (Unauthenticated)
**Route:** `/` or `/#/login`

**Purpose:** Entry point for unauthenticated users

**Components:**
- **Header**
  - Logo
  - Site title/tagline
  
- **Main Content**
  - Welcome message / value proposition
  - Brief description of the service
  
- **Login Form**
  - Username input
  - Password input
  - "Remember me" checkbox
  - Login button
  - "Forgot password?" link
  - "Register" link/tab
  - Error message display area
  
- **Register Form** (toggle/tab view)
  - Username input (with availability check)
  - Password input (with strength indicator)
  - Name input
  - Email input
  - Register button
  - "Back to login" link
  - Validation error display
  
- **Forgot Password Form** (toggle/tab view)
  - Email input
  - Submit button
  - Back to login link
  - Success/error message area

**Features:**
- Tab/toggle between login, register, and forgot password
- Form validation with inline error messages
- Loading states during submission
- Responsive layout (mobile-first)

---

### 2. **Main Dashboard** (Authenticated)
**Route:** `/#/dashboard` or `/#/lists`

**Purpose:** Primary interface for authenticated users to manage their wishlists

**Layout:**

#### **Header (Top Bar)**
- Logo (clickable → home)
- Search bar (global search for users/lists)
- User menu dropdown
  - Profile
  - Settings
  - Logout
- Mobile: Hamburger menu icon

#### **Sidebar (Desktop) / Drawer Menu (Mobile)**

**My Lists Section:**
- Section header "My Lists"
- "+ New List" button (prominent)
- List of user's own lists:
  - List name
  - Item count badge (e.g., "12 items")
  - Active/selected state indicator
  - Edit icon (opens edit modal)
  - Delete icon (with confirmation)
  - Privacy indicator (public/private icon)

**Following Section:**
- Section header "Following" / "Friends' Lists"
- Grouped by user/friend:
  - Friend name (header)
  - Their lists below with:
    - List name
    - Item count
    - Active/selected state
    - Unfollow button/icon
- Empty state if not following anyone

**Search Section:**
- Search input with icon
- "Find friends and lists" placeholder
- Recent searches (optional)

#### **Main Content Area**

**When No List Selected:**
- Welcome message
- Quick actions:
  - Create your first list
  - Search for friends
  - Browse public lists
- Getting started guide / tips

**When List Selected:**

**List Header:**
- List name (editable on click if owner)
- Owner name (if not own list)
- List metadata:
  - Creation date
  - Last updated date
  - Public/private toggle (if owner)
- Action buttons:
  - Share button (if owner)
  - Edit list button (if owner)
  - Delete list button (if owner)
  - Follow/Unfollow button (if not owner)
  
**Items Section:**
- "+ Add Item" button (if owner)
- Filter/sort controls:
  - Sort by: Priority, Date added, Name, Price
  - Filter: Show all / Hide donated / Show only available
  - Search items within list
  
**Item Display** (Cards or List View - user preference)

Each Item Shows:
- Item name (bold, primary)
- Description (truncated with "read more")
- URL (as clickable link with icon)
- Price (formatted)
- Priority indicator (visual: stars, color bar, or number)
- Status badge:
  - Available (green)
  - Reserved (yellow) - shows who reserved
  - Donated (gray) - shows who donated + optional comment
  - Show-from date (if future, show countdown)
  
**Actions (depends on ownership & status):**

If **Owner** of list:
- Edit button
- Delete button
- View who reserved/donated

If **Following** the list:
- Reserve button (if available)
- Donate button (if available or reserved by self)
- Take back button (if reserved/donated by self)
- Add comment when donating

**Empty State:**
- Friendly message: "No items yet"
- "Add your first item" CTA (if owner)
- Illustration (optional)

---

### 3. **Search Results Page**
**Route:** `/#/search?q=query`

**Purpose:** Display search results for users and lists

**Components:**
- Search query display ("Results for: [query]")
- Result count
- Back button / breadcrumb

**Results Layout:**

**Users Section:**
- Section header: "Users"
- User cards:
  - Avatar/icon
  - Name
  - Username
  - Member since date
  - Follow button (to see their public lists)
  
**Lists Section:**
- Section header: "Public Lists"
- List cards:
  - List name
  - Owner name
  - Item count
  - Last updated
  - Follow button
  - Preview of top items (optional)

**Empty State:**
- "No results found for [query]"
- Suggestions:
  - Try different keywords
  - Check spelling
  - Browse popular lists
  
---

### 4. **Public Share Page** (No Login Required)
**Route:** `/#/share/:encodedId` or `/share/:encodedId`

**Purpose:** Publicly accessible view of a shared wishlist

**Components:**
- **Header**
  - Logo
  - "Login" or "Create Account" link
  
- **List Information**
  - List name (large, prominent)
  - Owner name
  - Description (if any)
  - Last updated date
  
- **Items Display** (Read-only)
  - All items in the list
  - Each item shows:
    - Name
    - Description
    - URL (clickable)
    - Price
    - Priority (visual indicator)
    - Status:
      - Available
      - Donated (with who donated and when)
  
- **Actions for Visitors:**
  - "Mark as Donated" button for available items
  - Donation modal:
    - Optional: Your name input
    - Optional: Comment/message
    - Confirm button
    - Success feedback
  
- **Footer:**
  - "Create your own wishlist" CTA
  - Link to main site
  
**Features:**
- No authentication required
- Can mark items as donated with optional name
- Responsive layout
- Social sharing buttons (optional)

---

### 5. **User Profile / Settings Page**
**Route:** `/#/profile` or `/#/settings`

**Purpose:** Manage user account settings

**Sections:**

**Profile Information:**
- Name (editable)
- Username (display only or editable)
- Email (editable, requires verification)
- Member since (display only)

**Account Settings:**
- Change password form:
  - Current password
  - New password
  - Confirm new password
- Email notifications toggle
- Privacy settings

**Statistics (Optional):**
- Total lists created
- Total items added
- Lists following
- Followers count

**Danger Zone:**
- Delete account button (with confirmation)

**Actions:**
- Save changes button
- Cancel button

---

## Modal Dialogs

### **Add/Edit List Modal**
**Trigger:** "New List" button or Edit icon on list

**Fields:**
- List name (required)
- Description (optional)
- Public/Private toggle
- Tags (optional, future)

**Actions:**
- Save
- Cancel

---

### **Add/Edit Item Modal**
**Trigger:** "+ Add Item" button or Edit icon on item

**Fields:**
- Item name (required)
- URL (optional, validated)
- Description (optional, textarea)
- Price (optional)
- Priority slider/input (1-100)
- Show from date (date picker, optional)
- Image URL (optional, future)

**Actions:**
- Save
- Cancel

---

### **Share List Modal**
**Trigger:** Share button on list

**Components:**
- Share link (auto-generated)
  - Copy to clipboard button
  - QR code (optional)
- Email section:
  - Email address input (multiple emails)
  - Personal message textarea (optional)
  - Send button
- Social share buttons (Facebook, Twitter, WhatsApp - optional)

**Actions:**
- Send email
- Copy link
- Close

---

### **Delete Confirmation Modal**
**Trigger:** Delete button on list or item

**Components:**
- Warning icon
- Warning message:
  - "Are you sure you want to delete [item/list name]?"
  - "This action cannot be undone."
  - If list: "This will also delete all [X] items in this list."
- Checkbox: "I understand this is permanent"

**Actions:**
- Confirm Delete (destructive, red)
- Cancel

---

### **Donate Item Modal** (Public Share Page)
**Trigger:** "Mark as Donated" button

**Components:**
- Item name (display)
- Optional fields:
  - Your name
  - Comment/message
- Privacy notice

**Actions:**
- Confirm
- Cancel

---

### **Reserve Item Modal** (Following a List)
**Trigger:** "Reserve" button

**Components:**
- Item name (display)
- Confirmation message
- Optional comment

**Actions:**
- Confirm reservation
- Cancel

---

## Navigation Flow

```
Landing/Login
    ↓ (successful login)
Main Dashboard
    ├→ Select List → View Items
    ├→ Search → Search Results → Follow List
    ├→ Create List → Edit List
    ├→ Profile/Settings
    └→ Logout → Landing/Login

Public Share Link
    ├→ View List (no login)
    ├→ Donate Item
    └→ Register/Login CTA
```

---

## Mobile Considerations

### Navigation
- Hamburger menu for sidebar
- Bottom navigation bar (optional):
  - Home/Lists
  - Search
  - Add (+)
  - Profile
  
### List View
- Stack sidebar and content vertically
- Separate pages for:
  - My Lists
  - Following
  - List detail
  - Item detail
  
### Touch Interactions
- Swipe gestures:
  - Swipe item left: Reveal delete/edit
  - Swipe item right: Quick reserve/donate
- Pull to refresh lists
- Tap to expand item details

### Responsive Breakpoints
- **Mobile:** < 768px
  - Single column layout
  - Collapsible sidebar → drawer
  - Stacked forms
  - Full-width modals
  
- **Tablet:** 768px - 1024px
  - Two column layout (sidebar + content)
  - Adapted spacing
  - Modal dialogs (not full screen)
  
- **Desktop:** > 1024px
  - Three column option (sidebar, list, item detail)
  - Fixed sidebar
  - Wider modals
  - Hover states

---

## State Management

### URL Hash Routing
- `#/` or `#/login` - Login page
- `#/register` - Register page
- `#/forgot-password` - Password reset
- `#/dashboard` - Main dashboard (default after login)
- `#/lists/:id` - Specific list view
- `#/search?q=query` - Search results
- `#/profile` - User profile
- `#/settings` - User settings
- `#/share/:encodedId` - Public share view

### Authentication States
1. **Unauthenticated** → Show login/register
2. **Authenticated** → Show dashboard
3. **Session Expired** → Redirect to login with message

### UI States
- **Loading** - Skeleton screens, spinners
- **Empty** - Helpful empty state messages
- **Error** - User-friendly error messages
- **Success** - Toast notifications for actions

---

## Accessibility Considerations

- Semantic HTML5 elements
- ARIA labels for interactive elements
- Keyboard navigation support:
  - Tab through forms
  - Enter to submit
  - Escape to close modals
  - Arrow keys in lists
- Focus indicators
- Screen reader friendly
- Color contrast compliance (WCAG AA)
- Skip to content link
- Alt text for images

---

## Summary of Main Pages

| Page | Route | Auth Required | Description |
|------|-------|---------------|-------------|
| Login/Register | `/#/login` | No | Landing page with login/register forms |
| Dashboard | `/#/dashboard` | Yes | Main app with lists and items |
| Search | `/#/search?q=` | Yes | Search results for users/lists |
| Public Share | `/#/share/:id` | No | Public view of shared list |
| Profile | `/#/profile` | Yes | User profile and settings |

Each page is designed to be:
- **Responsive** - Works on all screen sizes
- **Performant** - Fast loading with lazy loading
- **Intuitive** - Clear navigation and actions
- **Accessible** - Keyboard and screen reader friendly
