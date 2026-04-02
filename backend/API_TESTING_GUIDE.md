# CRM Backend API Testing Guide (Postman)

This guide provides exactly what you need to test your backend standalone via Postman or Insomnia.

## Base Configuration Local Setup
- **Base URL**: `http://localhost:5000`
- **Default Headers**: Set `Content-Type` to `application/json`

---

## 1. Register a New User

**Endpoint:** `POST /api/auth/register`

**Sample Request Body (JSON):**
```json
{
  "name": "Test Administrator",
  "email": "admin@test.com",
  "password": "securepassword123"
}
```

**Sample Success Response (201 Created):**
```json
{
  "_id": "651d6c8b9d3b4e7235a90123",
  "name": "Test Administrator",
  "email": "admin@test.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI..."
}
```
*Note: Make sure to copy the `token` value for protected route testing below.*

**Sample Error Responses:**
- **400 Bad Request:** `{ "message": "User already exists" }`
- **400 Bad Request:** `{ "message": "Please provide all required fields" }`

---

## 2. Login User

**Endpoint:** `POST /api/auth/login`

**Sample Request Body (JSON):**
```json
{
  "email": "admin@test.com",
  "password": "securepassword123"
}
```

**Sample Success Response (200 OK):**
```json
{
  "_id": "651d6c8b9d3b4e7235a90123",
  "name": "Test Administrator",
  "email": "admin@test.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI..."
}
```

**Sample Error Responses:**
- **401 Unauthorized:** `{ "message": "Invalid email or password" }`

---

## 3. Create a Customer (Protected Route)

> **IMPORTANT**: This is a *Protected Route*. You must copy the `token` string returned from the register or login endpoints above, and paste it into Postman's **Authorization** tab. Select **Bearer Token**, and paste your token in the field.

**Endpoint:** `POST /api/customers`

**Sample Request Body (JSON):**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "555-0192",
  "company": "Example Inc."
}
```

**Sample Success Response (201 Created):**
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "phone": "555-0192",
  "company": "Example Inc.",
  "_id": "651d6cb49d3b4e7235a90456",
  "createdAt": "2026-03-26T14:45:00.000Z",
  "updatedAt": "2026-03-26T14:45:00.000Z",
  "__v": 0
}
```

**Sample Error Responses:**
- **400 Bad Request:** `{ "message": "Name and email are required parameters" }`
- **401 Unauthorized:** `{ "message": "Not authorized, no token provided" }` (If you forgot to set the Bearer token in Postman)
- **401 Unauthorized:** `{ "message": "Not authorized, token failed" }` (If the token is invalid/expired)
