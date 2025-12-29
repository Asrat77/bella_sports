# AGENTS.md

## Build/Lint/Test Commands

### Rails Backend
- `bin/ci` - Run full CI pipeline (setup, lint, security)
- `bin/rubocop` - Run Ruby linter
- `bin/rails test` - Run all tests
- `bin/rails test test/path/to_test.rb` - Run single test file
- `bin/bundler-audit` - Check for security vulnerabilities
- `bin/brakeman` - Run security analysis

### Next.js Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Code Style Guidelines

### Ruby/Rails (37signals-inspired)
- Follow Omakase Ruby styling via rubocop-rails-omakase
- **Thin controllers, rich models** - business logic lives in models
- **CRUD-only routing** - create new resources for state changes, not custom actions
- **State as records, not booleans** - use separate records for state (e.g., Closure instead of closed:boolean)
- **Heavy use of concerns** - organize model behavior into focused concerns (50-150 lines each)
- **Default values via lambdas** - `belongs_to :creator, default: -> { Current.user }`
- **Use `params.expect`** - `params.expect(user: [:name, :email])` instead of require/permit
- **Database-backed everything** - Solid Queue/Cache/Cable over Redis
- **UUIDs as primary keys** - security and distribution benefits
- **Minimal validations** - only essential validations in models
- **Let it crash** - use bang methods (`create!`) in controllers

### TypeScript/React
- Use strict TypeScript with proper interfaces
- Import order: React/Next.js → third-party → local components
- Component files: PascalCase, co-located CSS modules
- State management with Zustand stores
- CSS Modules for styling (ComponentName.module.css)

### General
- Use descriptive variable names
- Handle errors gracefully
- Follow existing patterns in codebase
- **Ship to validate** - prototype quality is valid for learning
- **Vanilla Rails over abstractions** - avoid premature extraction

## 37signals Patterns Learned from Codebase

### Core Patterns Implemented
1. **State as records, not booleans**: Order status is a separate `order_statuses` table with `creator_id`, not a status column. `Statusable` concern defines `STATUS_TRANSITIONS` hash and `update_status!` method.

2. **Rich models with concerns**: Product includes Badgeable, Inventoryable, Searchable concerns. Each concern is 40-100 lines, focused on specific behavior.

3. **Thin controllers, rich models**: `OrdersController.create` just calls `Order#add_item`. Business logic lives in models.

4. **UUID primary keys**: All tables use `id: :uuid, default: -> { "gen_random_uuid()" }` for security and distribution.

5. **Database-backed everything**: Solid Queue/Cache/Cable instead of Redis. Good for simplicity and deployment.

6. **params.expect**: Using Rails 8's new params API: `params.expect(order: [:customer_name, :customer_phone, { items: [...] }])`

7. **Concerns for organization**: Controller concerns (Pagination, JsonResponse, Filterable, Authenticatable) mixed into Common module.

8. **Bang methods in controllers**: `add_item!`, `find_by_tracking!` - let it crash approach.

### Where Bella Sports Differs from 37signals Guide
- Uses React/Next.js instead of Turbo+Stimulus (legitimate choice for this project's needs)
- Next.js API proxy for local development (convenience, not strictly necessary)
- Active Model Serializers instead of plain Rails rendering (more explicit control)

## Commit Conventions
- Mix of conventional commits (feat:, chore:, docs:, style:, fix:) and descriptive messages
- Single contributor (Asrat) - no team conventions yet
- Branch strategy: feature branches merged to master, no PR workflow enforced

## Code Style
- Ruby: rubocop-rails-omakase (37signals omakase style)
- TypeScript: Strict TypeScript, proper interfaces, import order: React/Next.js → third-party → local
- Component files: PascalCase, co-located CSS modules

## Known Issues/Gaps
- Admin controllers not yet implemented (routes defined in routes.rb but no controller files)
- CI only runs Ruby checks (Brakeman, Bundler-audit, RuboCop) - no frontend lint/type-check in CI
- Frontend next.config has ignoreBuildErrors: true and ignoreDuringBuilds: true for lint/TS

## Git Setup
- Local branch: feature/telegram-user-authentication
- Remote branches: master, agent-404-error-b214, feature/telegram-user-authentication, dependabot/*
- Main branch is master (not main)

## Development Notes
- CORS configured for localhost:3000 (frontend) and bellasports.com (production)
- Development uses letter_opener_web for mailer preview
- Allowed hosts include ngrok and netlify for tunnel testing