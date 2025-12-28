# Telegram Authentication Setup Guide

## Overview

Bellasport now supports Telegram-based user authentication. This provides a seamless, one-click login experience for customers using Telegram.

## Features

- **One-click login** using Telegram account
- **Secure authentication** with HMAC-SHA256 signature verification
- **Long-lasting sessions** (30 days)
- **Optional email collection** (not required for auth)
- **Phone number required** for orders
- **Telegram notifications** for order updates (if user has username)

## Backend Setup

### 1. Create a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow instructions to create your bot
4. Save the **bot token** provided (starts with `123456789:ABC...`)
5. Configure your bot:
   - Set a profile picture (use your website logo)
   - Give it a name related to your brand (e.g., "Bellasport Bot")

### 2. Link Your Domain to the Bot

1. In @BotFather, send `/setdomain`
2. Select your bot
3. Enter your domain (e.g., `bellasport.et` or `localhost:3000` for development)
4. For production, you'll need your actual domain

### 3. Add Bot Token to Rails Credentials

```bash
bin/rails credentials:edit
```

Add the following to your credentials file:

```yaml
telegram_bot_token: "YOUR_BOT_TOKEN_HERE"
```

### 4. Environment Variables (Optional)

If you prefer environment variables, add to `.env`:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_here
```

Then update `app/services/telegram_auth_service.rb`:

```ruby
def self.telegram_bot_token
  ENV['TELEGRAM_BOT_TOKEN'] || Rails.application.credentials.telegram_bot_token
end
```

## Frontend Setup

### 1. Create Environment File

Create `client/.env.local`:

```bash
# Telegram Bot Configuration
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

# API URL (defaults to localhost:3000)
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 2. Install Dependencies

```bash
cd client
npm install
```

### 3. Start Development Servers

**Backend (Rails):**
```bash
bin/rails server
```

**Frontend (Next.js):**
```bash
cd client
npm run dev
```

## Testing

### Manual Testing with Telegram

1. Start both servers
2. Navigate to `http://localhost:3000/account` in your browser
3. You should see a "Sign in to your account" page
4. Click the "Log in with Telegram" button
5. Telegram app will open (or web login)
6. Authorize the app
7. You should be redirected back and logged in

### Testing API Directly

You can test the authentication flow without the Telegram widget by constructing a test payload:

```bash
# This is for development testing only
# In production, you must use the Telegram widget
```

## Database Schema

### Users Table

```ruby
- id (UUID, primary key)
- telegram_id (string, unique, indexed)
- first_name (string)
- last_name (string)
- username (string)
- email (string, optional, indexed)
- phone_number (string, optional, indexed, format: 9 digits)
- photo_url (string)
- store_credit_balance (integer, default: 0)
- active (boolean, default: true, indexed)
- created_at, updated_at
```

### UserSessions Table

```ruby
- id (UUID, primary key)
- user_id (UUID, foreign key, indexed)
- token (string, unique, indexed)
- expires_at (datetime, indexed)
- last_used_at (datetime)
- created_at, updated_at
```

## API Endpoints

### POST `/api/v1/auth/telegram_callback`

Authenticates user via Telegram widget data.

**Request Body:**
```json
{
  "id": "123456789",
  "first_name": "John",
  "last_name": "Doe",
  "username": "johndoe",
  "photo_url": "https://...",
  "auth_date": 1234567890,
  "hash": "verified_hash_string"
}
```

**Response:**
```json
{
  "id": "uuid",
  "token": "session_token",
  "expires_at": "2025-01-27T...",
  "user": {
    "id": "uuid",
    "telegram_id": "123456789",
    "first_name": "John",
    "last_name": "Doe",
    "username": "johndoe",
    "email": null,
    "phone_number": null,
    "photo_url": "https://...",
    "full_name": "John Doe",
    "store_credit_balance": 0,
    "store_credit_in_etb": 0.0,
    "telegram_notification_available": true
  }
}
```

### GET `/api/v1/auth/me`

Get current authenticated user info.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
  "id": "uuid",
  "telegram_id": "123456789",
  "first_name": "John",
  "last_name": "Doe",
  ...
}
```

## Security Notes

1. **Hash Verification**: All Telegram auth data is verified using HMAC-SHA256
2. **Freshness Check**: Auth data expires after 5 minutes to prevent replay attacks
3. **Session Duration**: Sessions last 30 days but are refreshed on each use
4. **Token Storage**: Tokens are stored in localStorage (frontend) and database (backend)
5. **HTTPS Required**: In production, your domain must use HTTPS

## Troubleshooting

### "Invalid Telegram authentication data"

- Check that `telegram_bot_token` is correctly set in credentials
- Verify your domain is linked via @BotFather
- Ensure auth_date is within 5 minutes

### "Authentication data is too old"

- This is intentional security measure
- Telegram widget should be used immediately after clicking

### "Bot username not found"

- Check `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` in `.env.local`
- Ensure bot is created and active

### Button doesn't appear

- Check browser console for errors
- Ensure Telegram widget script is loading
- Verify bot username is correct

## Future Enhancements

- [ ] Phone number collection via Telegram (requires additional permissions)
- [ ] Email/password fallback authentication
- [ ] Multi-factor authentication
- [ ] Social sharing of purchased kits
- [ ] Challenge participation notifications via Telegram
- [ ] Promo code notifications via Telegram

## Resources

- [Telegram Login Widget Docs](https://core.telegram.org/widgets/login)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [BotFather](https://t.me/BotFather)
