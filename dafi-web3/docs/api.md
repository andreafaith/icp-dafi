# DAFI API Documentation

## Overview
DAFI (Decentralized Agricultural Finance) is a platform that enables agricultural asset tokenization and investment. This document outlines the available API endpoints and their usage.

## Authentication
All API endpoints require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL
```
https://api.dafi.network/v1
```

## Endpoints

### Users

#### Register User
```http
POST /api/users/:role
```
Register a new user (farmer/investor)

**Parameters:**
- `role` (string): 'farmer' or 'investor'

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "walletAddress": "string",
  "profile": {
    "experience": "string",
    "specialization": "string"
  }
}
```

### Assets

#### Create Asset
```http
POST /api/assets
```
Create a new tokenized asset

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "location": "string",
  "type": "string",
  "totalShares": "number",
  "pricePerShare": "number",
  "documentation": "string"
}
```

#### Get Asset
```http
GET /api/assets/:id
```
Get asset details

**Parameters:**
- `id` (string): Asset ID

### Investments

#### Create Investment
```http
POST /api/investments
```
Create a new investment

**Request Body:**
```json
{
  "assetId": "string",
  "amount": "number",
  "shares": "number"
}
```

#### Get Investments
```http
GET /api/investments
```
Get user investments

**Query Parameters:**
- `status` (string): Filter by status
- `page` (number): Page number
- `limit` (number): Items per page

### Returns

#### Process Distribution
```http
POST /api/returns/distribute
```
Process returns distribution

**Request Body:**
```json
{
  "assetId": "string",
  "amount": "number",
  "period": "string"
}
```

#### Get Distribution History
```http
GET /api/returns/:assetId/history
```
Get returns distribution history

**Parameters:**
- `assetId` (string): Asset ID

### Analytics

#### Get Portfolio Analytics
```http
GET /api/analytics/portfolio
```
Get portfolio analytics

**Query Parameters:**
- `timeframe` (string): Analysis timeframe
- `metrics` (string[]): Required metrics

#### Get Asset Analytics
```http
GET /api/analytics/assets/:id
```
Get asset analytics

**Parameters:**
- `id` (string): Asset ID

## Response Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

API requests are limited to:
- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

## Websocket API

Connect to real-time updates:
```
wss://api.dafi.network/ws
```

### Events

- `asset.update`: Asset updates
- `investment.create`: New investment
- `return.distribute`: Return distribution
- `price.update`: Price updates

## Error Handling

Error responses follow this format:
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Smart Contract Integration

### Asset Contract
- Contract ID: `rrkah-fqaaa-aaaaa-aaaaq-cai`
- Methods:
  - `createAsset`
  - `getAsset`
  - `updateAsset`
  - `transferShares`

### Investment Contract
- Contract ID: `ryjl3-tyaaa-aaaaa-aaaba-cai`
- Methods:
  - `createInvestment`
  - `getInvestment`
  - `updateInvestment`
  - `processReturns`

## Examples

### Create Asset
```javascript
const response = await fetch('/api/assets', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Organic Farm',
    description: 'Sustainable organic farming project',
    location: 'California, USA',
    type: 'Farm',
    totalShares: 1000,
    pricePerShare: 100,
  }),
});
```

### Make Investment
```javascript
const response = await fetch('/api/investments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    assetId: 'asset123',
    amount: 10000,
    shares: 100,
  }),
});
```
