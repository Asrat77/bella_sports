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