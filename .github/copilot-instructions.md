# Ecommerce Website - Project Context

## Project Overview

Ecommerce website for a {business_category} business, built with SvelteKit 2 and Svelte 5, integrated with Stripe for product management, pricing, and payment processing.

## Current Technology Stack

### Framework & Build Tools
- **SvelteKit**: 2.47.1 (latest v2)
- **Svelte**: 5.41.0 (using new runes API)
- **Vite**: 7.1.10
- **Adapter**: `@sveltejs/adapter-auto` v7.0.0 (auto-detects deployment platform)
- **Preprocessor**: vitePreprocess for TypeScript/SCSS support

### Styling
- **Tailwind CSS**: 4.1.14 with Vite plugin (latest v4)
- Global styles imported in root layout
- Modern Tailwind v4 setup using `@import` directive

### TypeScript
- **Version**: 5.9.3
- Strict mode enabled for production-quality code
- Module resolution set to "bundler"
- Extends SvelteKit's generated config
- svelte-check for type checking

### Current Project Structure
```
/
├── src/
│   ├── app.css (Tailwind imports)
│   ├── app.d.ts (TypeScript declarations)
│   ├── app.html (HTML template)
│   ├── lib/
│   │   ├── index.ts
│   │   └── assets/
│   └── routes/
│       ├── +layout.svelte (global layout with Svelte 5 runes)
│       └── +page.svelte (home page)
├── static/
│   └── robots.txt
├── package.json
├── svelte.config.js
├── tsconfig.json
└── vite.config.ts
```

### Svelte 5 Patterns in Use
- Runes syntax (`$props()`, `$state`, `$derived`, etc.)
- Layout composition with `{@render children()}`
- `$lib` import alias configured
- TypeScript throughout

## Planned Features & Implementation Roadmap

### Phase 1: Foundation & Stripe Integration
- Install `stripe` npm package
- Create `.env` file with Stripe API keys (test & production)
- Configure Stripe webhook secrets
- Set up Stripe CLI for local testing
- Create utility functions for Stripe API calls

### Phase 2: Database Layer
- Choose ORM: Prisma or Drizzle
- Design database schema:
  - Products (synced from Stripe or standalone)
  - Orders (linked to Stripe Payment Intents/Checkout Sessions)
  - Customers (user accounts, addresses)
  - Cart sessions (for persistent carts)
- Set up database (PostgreSQL recommended, SQLite for development)
- Create migration system

### Phase 3: Product Catalog
- Create `/products` route for product listing
- Create `/products/[id]` route for product details
- Fetch products from Stripe API in `+page.server.ts` files
- Display product information:
  - Product images
  - Descriptions
  - Pricing (with support for multiple units/sizes)
  - Inventory status
  - Product variants (if applicable)

### Phase 4: Shopping Cart
- Create cart store using Svelte 5 `$state` rune
- Persist cart to localStorage and/or server-side session
- Build cart UI component with:
  - Add to cart functionality
  - Remove items
  - Update quantities
  - Price calculations (subtotal, tax, shipping estimates)
- Cart preview in header/sidebar

### Phase 5: Checkout Flow
- Create `/checkout` route with form
- Implement server-side form actions in `+page.server.ts`
- Integrate Stripe Checkout Session or Payment Elements
- Collect shipping/billing information
- Handle success/cancel redirects
- Create `/api/webhooks/stripe/+server.ts` for webhook handling:
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
- Order confirmation page

### Phase 6: Customer Dashboard
- Implement authentication system (choose one):
  - Lucia Auth (lightweight, SvelteKit-native)
  - Auth.js (feature-rich, multiple providers)
  - Custom JWT solution
- Create protected routes:
  - `/account` - Customer dashboard
  - `/orders` - Order history
  - `/orders/[id]` - Order details
- Display:
  - Customer information
  - Past purchases
  - Order status tracking
  - Saved addresses

## Key Decisions to Make

### 1. Product Management Strategy
**Options:**
- **Stripe-centric**: Manage all product data (images, descriptions, inventory) in Stripe dashboard
- **Hybrid**: Use Stripe for pricing/checkout, manage product content in headless CMS or database
- **Database-first**: Store products in database, sync pricing to Stripe

**Recommendation**: Consider hybrid approach - store product content/images in database or CMS, sync pricing to Stripe for checkout

### 2. Authentication Strategy
**Options:**
- **Customer accounts**: Full authentication with order history, saved addresses, wishlists
- **Guest checkout only**: No accounts required, email-based order lookup
- **Hybrid**: Guest checkout available, optional account creation

**Recommendation**: Hybrid approach for best UX - allow guest checkout, offer account creation for returning customers

### 3. Deployment Platform
**Options:**
- **Vercel**: Easiest SvelteKit deployment, automatic previews, serverless functions
- **Cloudflare Pages**: Edge deployment, includes D1 database, R2 storage
- **Self-hosted Node.js**: Full control, use `@sveltejs/adapter-node`
- **Netlify**: Similar to Vercel, serverless functions

**Adapter Requirements**: Switch from `adapter-auto` to specific adapter based on chosen platform

### 4. Email Service
**Options:**
- **Resend**: Developer-friendly, React Email templates, good pricing
- **SendGrid**: Enterprise-grade, robust features
- **Postmark**: Focused on transactional emails, excellent deliverability
- **AWS SES**: Cost-effective at scale

**Use cases**: Order confirmations, shipping notifications, password resets, marketing (optional)

### 5. Database Choice
**Options:**
- **PostgreSQL**: Production-ready, hosted on Neon, Supabase, or Railway
- **SQLite**: Simple for development, consider Turso for production edge deployment
- **MySQL**: Alternative to PostgreSQL

**ORM Options:**
- **Prisma**: Excellent TypeScript support, migrations, Prisma Studio
- **Drizzle**: Lighter, faster, more control over SQL

### 6. Image Storage
**Options:**
- **Cloudflare R2**: S3-compatible, no egress fees
- **AWS S3**: Industry standard
- **Uploadthing**: Developer-friendly, built for Next.js/SvelteKit
- **Database**: Store in database (not recommended for production)

## Missing Infrastructure (To Be Implemented)

### Backend
- [ ] Database ORM configuration
- [ ] API routes (`+server.ts` files)
- [ ] Server-side form actions
- [ ] Stripe webhook handlers
- [ ] Environment variable management
- [ ] Session/cookie handling

### Frontend
- [ ] Product listing components
- [ ] Product detail pages
- [ ] Shopping cart UI
- [ ] Checkout form
- [ ] Order confirmation page
- [ ] Customer dashboard
- [ ] Authentication UI (login/register)

### Additional Features
- [ ] Error handling & custom error pages
- [ ] SEO optimization (meta tags, sitemap, structured data)
- [ ] Email templates
- [ ] Admin dashboard (optional)
- [ ] Inventory management
- [ ] Shipping calculation
- [ ] Tax calculation (Stripe Tax or custom)
- [ ] Analytics integration

## Stripe Integration Details

### Products to Manage
- Core product catalog (physical goods, digital items, or services)
- Variant attributes (size, color, material, format, duration, etc.)
- Unit / package sizes (single, multi-pack, bulk tiers)
- Subscription / recurring plans (weekly, monthly, annual)
- Bundles / kits / starter packs (curated combinations, gift sets)
- Limited / seasonal / pre-order items
- Add-ons / upsells (warranty, customization, gift wrap)
- Gift cards (fixed or variable value)

### Stripe Features to Implement
- **Products & Prices API**: Fetch product catalog
- **Checkout Sessions**: Hosted checkout page
- **Payment Intents**: Custom payment flow (alternative)
- **Webhooks**: Event-driven order processing
- **Customer Portal**: Let customers manage subscriptions
- **Stripe Tax**: Automatic tax calculation (optional)
- **Stripe Shipping**: Shipping rate calculation (optional)

### API Endpoints Needed
```
/api/webhooks/stripe/+server.ts      - Webhook handler
/api/products/+server.ts              - Product fetching (optional)
/api/create-checkout-session/+server.ts - Initialize checkout
/api/cart/+server.ts                  - Cart operations (optional)
```

## Development Workflow

### Environment Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run development server
npm run dev

# Type checking
npm run check

# Build for production
npm run build

# Preview production build
npm run preview
```

### Required Environment Variables
```
# Stripe
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Database
DATABASE_URL=postgresql://...

# Email
EMAIL_API_KEY=...

# Session
SESSION_SECRET=...
```

## Code Patterns & Best Practices

### SvelteKit Conventions
- Use `+page.svelte` for routes
- Use `+page.server.ts` for server-side data loading and form actions
- Use `+layout.svelte` for shared layouts
- Use `+server.ts` for API endpoints
- Use `$lib` for reusable components and utilities

### Svelte 5 Runes
- `$state()` for reactive state
- `$derived()` for computed values
- `$effect()` for side effects
- `$props()` for component props
- Use `$bindable()` for two-way binding

### TypeScript Types
- Define types in `.d.ts` files or alongside components
- Use Prisma-generated types for database models
- Use Stripe SDK types for Stripe objects
- Leverage `App.PageData` and `App.Locals` for type safety

### Error Handling
- Use SvelteKit's `error()` helper for throwing errors
- Create custom error pages (+error.svelte)
- Validate form data with superforms or custom validation
- Handle Stripe errors gracefully (card declined, etc.)

## Business-Specific Considerations

### Product Variants
- Highlight production or creation date (freshness/recency)
- Clear storage / care instructions
- Specification or nutritional data (where applicable)
- Certifications / compliance marks (e.g., safety, organic, standards)
- Source / provenance information (origin, materials, components)

### Ecommerce Features
- Weight-based shipping calculations
- Bulk pricing discounts
- Subscription options for regular customers
- Product recommendations based on baking needs

### SEO & Marketing
- Blog for baking tips and recipes
- Email newsletter for new products
- Social media integration
- Customer reviews and testimonials
- Structured data for product markup

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes Documentation](https://svelte-5-preview.vercel.app/docs/runes)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [Stripe Checkout Integration](https://stripe.com/docs/checkout/quickstart)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
