# API Documentation - Verlanglijstje v3

Base URL: `/api`

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register New User
```
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!",
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful",
  "user": {
    "id": 123,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "since": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Username already exists"
}
```

---

### Login
```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "since": "2024-01-15T10:30:00.000Z",
    "lastlogin": "2024-01-20T14:22:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

---

### Forgot Password
```
POST /api/auth/forgot-password
```

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset email sent"
}
```

---

### Reset Password
```
POST /api/auth/reset-password
```

**Request Body:**
```json
{
  "token": "reset_token_from_email",
  "password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password successfully reset"
}
```

---

## User Endpoints

### Get Current User Profile
```
GET /api/user/profile
Auth: Required
```

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 123,
    "username": "johndoe",
    "name": "John Doe",
    "email": "john@example.com",
    "since": "2024-01-15T10:30:00.000Z",
    "lastlogin": "2024-01-20T14:22:00.000Z"
  }
}
```

---

### Update User Profile
```
PUT /api/user/profile
Auth: Required
```

**Request Body:**
```json
{
  "name": "John Updated Doe",
  "email": "newemail@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 123,
    "username": "johndoe",
    "name": "John Updated Doe",
    "email": "newemail@example.com"
  }
}
```

---

### Update Password
```
PUT /api/user/password
Auth: Required
```

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

---

## List Endpoints

### Get All Lists (Own + Following)
```
GET /api/lists
Auth: Required
```

**Response (200 OK):**
```json
{
  "success": true,
  "myLists": [
    {
      "id": 456,
      "name": "Birthday Wishlist 2024",
      "public": "Y",
      "itemCount": 12,
      "lastupdate": "2024-01-20T10:00:00.000Z"
    }
  ],
  "followedLists": [
    {
      "id": 789,
      "name": "Emma's Christmas List",
      "public": "Y",
      "itemCount": 8,
      "lastupdate": "2024-01-18T15:30:00.000Z",
      "owner": {
        "id": 124,
        "name": "Emma Smith"
      }
    }
  ]
}
```

---

### Get Single List Details
```
GET /api/lists/:id
Auth: Required
```

**Response (200 OK):**
```json
{
  "success": true,
  "list": {
    "id": 456,
    "name": "Birthday Wishlist 2024",
    "public": "Y",
    "lastupdate": "2024-01-20T10:00:00.000Z",
    "owner": {
      "id": 123,
      "name": "John Doe"
    },
    "isOwner": true,
    "isFollowing": false
  },
  "items": [
    {
      "id": 1001,
      "name": "Running Shoes",
      "url": "https://example.com/shoes",
      "description": "Size 42, blue color preferred",
      "price": "€89.99",
      "priority": 90,
      "status": "A",
      "givenby": null,
      "givenname": null,
      "givencomment": null,
      "givenat": null,
      "showfrom": null
    },
    {
      "id": 1002,
      "name": "Book: The Hobbit",
      "url": "",
      "description": "Hardcover edition",
      "price": "€25",
      "priority": 50,
      "status": "S",
      "givenby": 125,
      "givenname": "Sarah",
      "givencomment": "Happy Birthday!",
      "givenat": "2024-01-19T12:00:00.000Z",
      "showfrom": null
    }
  ]
}
```

---

### Create New List
```
POST /api/lists
Auth: Required
```

**Request Body:**
```json
{
  "name": "Christmas 2024",
  "public": "Y"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "List created successfully",
  "list": {
    "id": 457,
    "name": "Christmas 2024",
    "public": "Y",
    "lastupdate": "2024-01-20T16:00:00.000Z"
  }
}
```

---

### Update List
```
PUT /api/lists/:id
Auth: Required (must be owner)
```

**Request Body:**
```json
{
  "name": "Christmas 2024 - Updated",
  "public": "N"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "List updated successfully",
  "list": {
    "id": 457,
    "name": "Christmas 2024 - Updated",
    "public": "N",
    "lastupdate": "2024-01-20T16:05:00.000Z"
  }
}
```

---

### Delete List
```
DELETE /api/lists/:id
Auth: Required (must be owner)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "List and all items deleted successfully"
}
```

---

### Follow List
```
POST /api/lists/:id/follow
Auth: Required
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Now following this list"
}
```

---

### Unfollow List
```
DELETE /api/lists/:id/follow
Auth: Required
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Unfollowed list successfully"
}
```

---

### Share List via Email
```
POST /api/lists/:id/share
Auth: Required (must be owner)
```

**Request Body:**
```json
{
  "email": "friend@example.com",
  "message": "Check out my wishlist!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Share email sent successfully",
  "shareUrl": "https://verlanglijstje.be/share/3456789"
}
```

---

## Item Endpoints

### Get Items for a List
```
GET /api/lists/:listId/items
Auth: Required
```

**Response:** Same as items array in Get Single List Details

---

### Add Item to List
```
POST /api/lists/:listId/items
Auth: Required (must be owner of list)
```

**Request Body:**
```json
{
  "name": "Wireless Headphones",
  "url": "https://example.com/headphones",
  "description": "Noise cancelling, over-ear",
  "price": "€150",
  "priority": 80,
  "showfrom": "2024-02-01"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Item added successfully",
  "item": {
    "id": 1003,
    "list": 456,
    "name": "Wireless Headphones",
    "url": "https://example.com/headphones",
    "description": "Noise cancelling, over-ear",
    "price": "€150",
    "priority": 80,
    "status": "A",
    "showfrom": "2024-02-01"
  }
}
```

---

### Update Item
```
PUT /api/items/:id
Auth: Required (must be owner of list)
```

**Request Body:**
```json
{
  "name": "Wireless Headphones - Updated",
  "url": "https://example.com/headphones-new",
  "description": "Noise cancelling, over-ear, black color",
  "price": "€140",
  "priority": 85,
  "showfrom": null
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item updated successfully",
  "item": {
    "id": 1003,
    "name": "Wireless Headphones - Updated",
    "url": "https://example.com/headphones-new",
    "description": "Noise cancelling, over-ear, black color",
    "price": "€140",
    "priority": 85,
    "status": "A"
  }
}
```

---

### Delete Item
```
DELETE /api/items/:id
Auth: Required (must be owner of list)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item deleted successfully"
}
```

---

### Reserve Item
```
POST /api/items/:id/reserve
Auth: Required (must be following the list)
```

**Request Body (optional):**
```json
{
  "comment": "I'll get this for you!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item reserved successfully",
  "item": {
    "id": 1001,
    "status": "R",
    "givenby": 125,
    "givenname": "Sarah",
    "givencomment": "I'll get this for you!",
    "givenat": "2024-01-20T16:30:00.000Z"
  }
}
```

---

### Mark Item as Donated
```
POST /api/items/:id/donate
Auth: Required (must have reserved it, or be viewing public share)
```

**Request Body (optional):**
```json
{
  "comment": "Enjoy your gift!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Item marked as donated",
  "item": {
    "id": 1001,
    "status": "S",
    "givenby": 125,
    "givenname": "Sarah",
    "givencomment": "Enjoy your gift!",
    "givenat": "2024-01-20T16:45:00.000Z"
  }
}
```

---

### Take Back Reservation/Donation
```
POST /api/items/:id/takeback
Auth: Required (must be the one who reserved/donated)
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Reservation/donation cancelled",
  "item": {
    "id": 1001,
    "status": "A",
    "givenby": null,
    "givenname": null,
    "givencomment": null,
    "givenat": null
  }
}
```

---

## Search Endpoints

### Search Users and Lists
```
GET /api/search?q=query
Auth: Required
```

**Parameters:**
- `q` (required): Search query string

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "id": 126,
      "name": "Emma Johnson",
      "username": "emmaj",
      "since": "2023-05-10T00:00:00.000Z"
    }
  ],
  "lists": [
    {
      "id": 790,
      "name": "Emma's Birthday 2024",
      "owner": {
        "id": 126,
        "name": "Emma Johnson"
      },
      "itemCount": 15,
      "public": "Y",
      "isFollowing": false
    }
  ]
}
```

---

## Public Share Endpoints

### Get Public Shared List
```
GET /api/share/:encodedId
Auth: Not Required
```

**Parameters:**
- `encodedId`: Encoded list ID from share URL

**Response (200 OK):**
```json
{
  "success": true,
  "list": {
    "id": 456,
    "name": "Birthday Wishlist 2024",
    "owner": {
      "name": "John Doe"
    },
    "lastupdate": "2024-01-20T10:00:00.000Z"
  },
  "items": [
    {
      "id": 1001,
      "name": "Running Shoes",
      "url": "https://example.com/shoes",
      "description": "Size 42, blue color preferred",
      "price": "€89.99",
      "priority": 90,
      "status": "A",
      "givenname": null,
      "showfrom": null,
      "shown": true
    },
    {
      "id": 1002,
      "name": "Book: The Hobbit",
      "url": "",
      "description": "Hardcover edition",
      "price": "€25",
      "priority": 50,
      "status": "S",
      "givenname": "Sarah",
      "givencomment": "Happy Birthday!",
      "showfrom": null,
      "shown": true
    }
  ]
}
```

---

### Donate Item from Public Share
```
POST /api/share/:encodedItemId/donate
Auth: Not Required
```

**Request Body:**
```json
{
  "givenname": "Anonymous Friend",
  "givencomment": "Hope you enjoy this!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Thank you! Item marked as donated",
  "listId": 456
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "You don't have permission to perform this action"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "An unexpected error occurred"
}
```

---

## Item Status Values

- `A` - Available
- `R` - Reserved
- `S` - Donated/Given (from Dutch "Schenken")

---

## Share ID Encoding

The share ID encoding algorithm (must match Java implementation):

**Encode:**
```javascript
function encodeShareId(id) {
  return ((id * 97) + 17) * 97 + 19;
}
```

**Decode:**
```javascript
function decodeShareId(encodedId) {
  return (((encodedId - 19) / 97) - 17) / 97;
}
```

---

## Rate Limiting

Authentication endpoints are rate-limited to prevent abuse:
- Login: 5 requests per 15 minutes per IP
- Register: 3 requests per hour per IP
- Forgot Password: 3 requests per hour per email

Other endpoints: 100 requests per 15 minutes per user

**Rate Limit Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": "Too many requests. Please try again later."
}
```

---

## Pagination (Future Enhancement)

For endpoints returning large lists, pagination will be added:

**Request:**
```
GET /api/lists?page=1&limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```
