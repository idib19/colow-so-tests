# ColowSo API Documentation

## Overview

The ColowSo API is a RESTful service that facilitates transaction management, account operations, and user authentication. The API supports multiple user roles with different permission levels, making it suitable for a hierarchical financial system.

## Authentication

The API uses JWT (JSON Web Token) for authentication. All protected endpoints require a valid token to be included in the request headers:

```
Authorization: Bearer <your_jwt_token>
```

## User Roles

The API supports three distinct user roles:

- **Master**: Users who can manage their own transactions and associated partners
- **Partner**: Users who can perform transactions and monitor their balance
- **Admin-ColowSo**: Super users with full system access and management capabilities

## API Endpoints

### Authentication

#### Login
- **POST** `/api/auth/login`
- **Description**: Authenticates user credentials and issues a JWT token
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Responses**:
  - `200 OK`: Authentication successful
  - `401 Unauthorized`: Invalid credentials

#### Register Master
- **POST** `/api/auth/register/master`
- **Description**: Creates a new master user (Admin-ColowSo only)
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string",
    "name": "string"
  }
  ```
- **Responses**:
  - `201 Created`: Master user created successfully
  - `401 Unauthorized`: Invalid admin credentials

#### Change Password
- **POST** `/api/auth/change-password`
- **Description**: Updates user password
- **Request Body**:
  ```json
  {
    "oldPassword": "string",
    "newPassword": "string"
  }
  ```
- **Responses**:
  - `200 OK`: Password updated
  - `400 Bad Request`: Invalid old password

### Master Operations

#### Create Transaction
- **POST** `/api/master/transaction`
- **Description**: Initiates a new master transaction
- **Request Body**:
  ```json
  {
    "issuerId": "string",
    "issuerModel": "Master",
    "senderInfo": {},
    "receiverInfo": {},
    "amount": "number"
  }
  ```
- **Responses**:
  - `201 Created`: Transaction successful
  - `400 Bad Request`: Invalid transaction data

#### Get Balance
- **GET** `/api/master/balance/:masterId`
- **Description**: Retrieves master account balance
- **Responses**:
  - `200 OK`: Returns current balance
  - `404 Not Found`: Master account not found

### Partner Operations

#### Create Transaction
- **POST** `/api/partner/transaction`
- **Description**: Initiates a new partner transaction
- **Request Body**:
  ```json
  {
    "issuerId": "string",
    "issuerModel": "Partner",
    "senderInfo": {},
    "receiverInfo": {},
    "amount": "number"
  }
  ```
- **Responses**:
  - `201 Created`: Transaction successful
  - `400 Bad Request`: Invalid transaction data

#### Get Balance
- **GET** `/api/partner/balance/:partnerId`
- **Description**: Retrieves partner account balance
- **Responses**:
  - `200 OK`: Returns current balance

### Admin Operations

#### Load Master Account
- **POST** `/api/colowso/load-master`
- **Description**: Adds funds to a master account (Admin-ColowSo only)
- **Request Body**:
  ```json
  {
    "masterId": "string",
    "amount": "number"
  }
  ```
- **Responses**:
  - `200 OK`: Account loaded successfully
  - `500 Internal Server Error`: Loading operation failed

#### View All Transactions
- **GET** `/api/colowso/transactions`
- **Description**: Retrieves complete transaction history (Admin-ColowSo only)
- **Responses**:
  - `200 OK`: Returns transaction list

### Admin Seeding
- Used for initial setup only
- Requires specific environment variables
- Protected in production environment
- Run using: `npm run seed:admin`

## Error Handling

The API uses standard HTTP status codes for error responses:

| Status Code | Description |
|------------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error - Server-side failure |

## Rate Limiting

To ensure system stability, API requests are rate-limited. Contact support for current limits and enterprise options.

## Support

For technical support or API inquiries, please contact our developer support team.

## Version

Current API Version: 1.0.0