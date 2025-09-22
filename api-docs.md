# Radiology Backend API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication Endpoints

### Register User

- **URL:** `/auth/register`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "patient|doctor|admin",
  "hospitalInfo": {
    "hospitalName": "string",
    "hospitalAddress": "string"
  },
  "doctorInfo": {
    "specialization": "string",
    "registrationNumber": "string",
    "licenseExpiry": "date",
    "department": "string",
    "shift": "string",
    "certifications": "string"
  },
  "patientInfo": {
    "dateOfBirth": "date",
    "medicalHistory": "string",
    "emergencyContact": "string",
    "bloodType": "string"
  }
}
```

- **Success Response:**
  - **Code:** 201
  - **Content:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_string"
}
```

### Login

- **URL:** `/auth/login`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "token": "jwt_token_string"
}
```

### Get User Profile

- **URL:** `/auth/profile`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "user": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "role": "string",
    "hospitalInfo": "object",
    "doctorInfo": "object",
    "patientInfo": "object",
    "assignedDoctor": "object|null"
  }
}
```

### Update User Profile

- **URL:** `/auth/profile`
- **Method:** `PUT`
- **Authentication:** Required (Bearer Token)
- **Content-Type:** `application/json`
- **Request Body:** Same as registration (all fields optional)

### Get Patients (Doctor Only)

- **URL:** `/auth/patients`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Access:** Doctor role only
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "patients": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "patientInfo": "object",
      "createdAt": "date"
    }
  ]
}
```

### Assign Patient to Doctor

- **URL:** `/auth/assign-patient`
- **Method:** `POST`
- **Authentication:** Required (Bearer Token)
- **Access:** Doctor role only
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "patientId": "string"
}
```

- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "message": "Patient assigned successfully"
}
```

### Unassign Patient from Doctor

- **URL:** `/auth/unassign-patient`
- **Method:** `POST`
- **Authentication:** Required (Bearer Token)
- **Access:** Doctor/Admin role only
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "patientId": "string"
}
```

- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "message": "Patient unassigned successfully"
}
```

### Get All Users for Assignment

- **URL:** `/auth/users`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Access:** Doctor/Admin role only
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "assignedDoctor": "object|null"
    }
  ]
}
```

## Admin Endpoints

### Get All Users (Admin Only)

- **URL:** `/auth/admin/users`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Access:** Admin role only
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "users": [
    {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "hospitalInfo": "object",
      "doctorInfo": "object",
      "patientInfo": "object",
      "assignedDoctor": "object|null",
      "createdAt": "date"
    }
  ]
}
```

### Create User (Admin Only)

- **URL:** `/auth/admin/users`
- **Method:** `POST`
- **Authentication:** Required (Bearer Token)
- **Access:** Admin role only
- **Content-Type:** `application/json`
- **Request Body:** Same as registration with additional `password` field
- **Success Response:**
  - **Code:** 201
  - **Content:**

```json
{
  "success": true,
  "message": "User created successfully",
  "user": "user_object"
}
```

### Update User (Admin Only)

- **URL:** `/auth/admin/users/:id`
- **Method:** `PUT`
- **Authentication:** Required (Bearer Token)
- **Access:** Admin role only
- **Content-Type:** `application/json`
- **Request Body:** Same as registration (all fields optional)
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "message": "User updated successfully",
  "user": "user_object"
}
```

### Delete User (Admin Only)

- **URL:** `/auth/admin/users/:id`
- **Method:** `DELETE`
- **Authentication:** Required (Bearer Token)
- **Access:** Admin role only
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## Prediction Endpoints

### Upload and Predict

- **URL:** `/predict`
- **Method:** `POST`
- **Authentication:** Required (Bearer Token)
- **Content-Type:** `multipart/form-data`
- **Form Data:**
  - `xray`: Image file (jpg, png, etc.)
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "prediction": {
    "id": "string",
    "result": "string (malignant/benign/non-nodule)",
    "confidence": "number",
    "probabilities": ["number", "number", "number"],
    "category": "string",
    "imageUrl": "string",
    "gradcamUrl": "string",
    "createdAt": "date"
  }
}
```

### Get Prediction History

- **URL:** `/predict/history`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "predictions": [
    {
      "id": "string",
      "result": "string",
      "confidence": "number",
      "category": "string",
      "imageUrl": "string",
      "createdAt": "date"
    }
  ]
}
```

### Get Specific Prediction

- **URL:** `/predict/:id`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **URL Parameters:**
  - `id`: Prediction ID
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "prediction": {
    "id": "string",
    "result": "string",
    "confidence": "number",
    "probabilities": "array",
    "category": "string",
    "imageUrl": "string",
    "gradcamUrl": "string",
    "createdAt": "date"
  }
}
```

## Feedback Endpoints

### Submit Feedback

- **URL:** `/feedback`
- **Method:** `POST`
- **Authentication:** Required (Bearer Token)
- **Content-Type:** `application/json`
- **Request Body:**

```json
{
  "predictionId": "string",
  "rating": "number (1-5)",
  "comment": "string"
}
```

- **Success Response:**
  - **Code:** 201
  - **Content:**

```json
{
  "success": true,
  "message": "Feedback submitted successfully"
}
```

### Get Feedback for a Prediction

- **URL:** `/feedback/:predictionId`
- **Method:** `GET`
- **Authentication:** Required (Bearer Token)
- **URL Parameters:**
  - `predictionId`: Prediction ID
- **Success Response:**
  - **Code:** 200
  - **Content:**

```json
{
  "success": true,
  "feedback": {
    "id": "string",
    "predictionId": "string",
    "rating": "number",
    "comment": "string",
    "createdAt": "date"
  }
}
```

## Error Responses

### Common Error Structure

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (if available)"
}
```

### Common Error Codes

- **400:** Bad Request
- **401:** Unauthorized
- **403:** Forbidden
- **404:** Not Found
- **422:** Unprocessable Entity
- **500:** Internal Server Error

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## File Upload Limits

- Maximum file size: 10MB
- Supported formats: jpg, jpeg, png
- Files are automatically saved in category-specific folders based on prediction results

## Rate Limiting

- API requests are limited to 100 requests per IP per hour
- Prediction endpoints are limited to 20 requests per user per hour

## Best Practices

1. Always handle error responses in your client application
2. Implement proper token management and refresh mechanisms
3. Validate file types and sizes before upload
4. Implement retry logic for failed requests
5. Cache prediction results when appropriate
