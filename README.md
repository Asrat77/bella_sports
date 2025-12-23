# Bella Sports 🏆⚽

A full-stack e-commerce platform for sports kits with Ethiopian Premier League, Premier League, La Liga, and National Team merchandise.

## Architecture

- **Frontend**: Next.js 15 with TypeScript, Zustand for state management
- **Backend**: Rails 8 API with PostgreSQL, ActiveModel::Serializer
- **Authentication**: Magic link authentication for admin panel
- **Payment**: Ready for Chapa integration (Ethiopian payment gateway)
- **Email**: Order confirmations and status updates

## Quick Start

### Prerequisites
- Ruby 3.4+
- Node.js 18+
- PostgreSQL (via Docker)
- Docker & Docker Compose

### Setup

1. **Clone and setup frontend:**
   ```bash
   cd client
   npm install
   npm run dev  # Runs on http://localhost:3000
   ```

2. **Setup backend:**
   ```bash
   # Install Ruby dependencies
   bundle install

   # Start PostgreSQL
   docker-compose up -d

   # Setup database
   bin/rails db:migrate
   bin/rails db:seed

   # Start Rails API server
   bin/rails server  # Runs on http://localhost:3001
   ```

3. **Test the API:**
   ```bash
   # Get products
   curl http://localhost:3001/api/v1/products

   # Create an order
   curl -X POST http://localhost:3001/api/v1/orders \
     -H "Content-Type: application/json" \
     -d '{"customer_name":"Test","customer_phone":"0911234567","delivery_method":"pickup","branch_id":1,"items":[{"product_id":1,"size":"M","quantity":1}]}'
   ```

## Features

### 🛍️ Storefront
- Product catalog with filtering and search
- Customizable kits (name & number personalization)
- Shopping cart with persistent state
- Ethiopian Birr pricing

### 📦 Order Management
- Multiple delivery options (pickup/delivery)
- Real-time order tracking
- Order status notifications via email
- Admin order management dashboard

### 🔐 Admin Panel
- Magic link authentication (no passwords)
- Product management with image uploads
- Order status updates
- Inventory management by size

### 🏗️ Architecture Highlights
- **37signals Patterns**: State as records, rich models, UUID primary keys
- **Security First**: Magic link auth, UUIDs prevent enumeration
- **Scalable**: PostgreSQL with proper indexing, background jobs
- **Maintainable**: Controller concerns, model concerns, serializers

## API Documentation

See `API_TESTING.md` for complete API documentation with curl examples.

## Development

### Running Tests
```bash
bin/rails test
```

### Code Quality
```bash
bin/rubocop  # Lint Ruby code
npm run lint  # Lint JavaScript/TypeScript
```

### Database
```bash
bin/rails db:migrate     # Run migrations
bin/rails db:seed        # Load seed data
bin/rails db:rollback    # Rollback migrations
```

## Deployment

### Production Setup
1. Set environment variables for database and email
2. Configure Chapa payment gateway
3. Deploy with Kamal (Docker-based deployment)

### Environment Variables
```bash
DB_HOST=your_db_host
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
SMTP_ADDRESS=your_smtp_host
SMTP_USERNAME=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

## Contributing

1. Create a feature branch from `main`
2. Follow the commit message conventions
3. Ensure tests pass and code is linted
4. Create a pull request with detailed description

## License

© 2025 Bella Sports. All rights reserved.# bella_sports
