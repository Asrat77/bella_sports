# Bella Sports API Testing Guide

## Setup
1. Start PostgreSQL with Docker: `docker-compose up -d`
2. Run migrations: `bin/rails db:migrate`
3. Seed data: `bin/rails db:seed`
4. Start server: `bin/rails server`

## API Endpoints

### Products
```bash
# Get all products
curl http://localhost:3000/api/v1/products

# Search products
curl "http://localhost:3000/api/v1/products?category=Ethiopian%20Premier%20League"

# Get product categories
curl http://localhost:3000/api/v1/products/categories

# Get single product
curl http://localhost:3000/api/v1/products/1
```

### Branches
```bash
# Get pickup branches
curl http://localhost:3000/api/v1/branches
```

### Orders
```bash
# Create order
curl -X POST http://localhost:3000/api/v1/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "customer_phone": "0911234567",
    "email": "test@example.com",
    "delivery_method": "pickup",
    "branch_id": 1,
    "items": [
      {
        "product_id": 1,
        "size": "M",
        "quantity": 1,
        "customization": {
          "name": "TEST",
          "number": "10"
        }
      }
    ]
  }'
```

## Admin Authentication (Magic Link)
```bash
# Request magic link (email will be sent)
curl -X POST http://localhost:3000/admin/admins/1/magic_link

# Verify magic link (token from email)
curl http://localhost:3000/admin/admins/1/verify/TOKEN_HERE
```

## Test Data
- Admin: admin@bellasports.com
- Password: bellasports2024
- 7 Products with inventory
- 3 Pickup branches
- Ethiopian Premier League, Premier League, La Liga kits