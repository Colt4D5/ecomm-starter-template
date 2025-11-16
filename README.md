# SvelteKit Ecommerce Starter

A modern, full-stack ecommerce starter template built with SvelteKit 2 and Svelte 5, featuring complete payment processing, order management, and a shopping cart. Perfect for launching any online store quickly.

## Tech Stack

- **[SvelteKit 2](https://kit.svelte.dev/)** - Full-stack framework with SSR
- **[Svelte 5](https://svelte.dev/)** - Modern reactive UI with runes API
- **[Stripe](https://stripe.com/)** - Payment processing and product management
- **[Prisma](https://www.prisma.io/)** - Type-safe database ORM
- **[PostgreSQL/SQLite](https://www.postgresql.org/)** - Relational database (SQLite for dev, PostgreSQL for production)
- **[Auth.js](https://authjs.dev/)** - Authentication (ready to configure)
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety throughout

## Features

✅ Product catalog synced from Stripe  
✅ Shopping cart with localStorage persistence  
✅ Stripe Checkout integration  
✅ Webhook handling for order processing  
✅ Database storage for orders and customers  
✅ Responsive design (ready for styling)  
✅ Type-safe API routes and database queries  

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Stripe account (free test mode available)
- PostgreSQL database (optional - SQLite works for development)

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd bread

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_secret_key
PUBLIC_STRIPE_KEY=pk_test_your_publishable_key

# Stripe Webhook Secret (for local: use Stripe CLI, for production: from dashboard)
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Application URL
PUBLIC_APP_URL=http://localhost:5173

# Database (SQLite for dev, PostgreSQL for production)
DATABASE_URL="file:./dev.db"
```

### 3. Database Setup

```bash
# Run database migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio to view your database
npx prisma studio
```

### 4. Stripe Setup

#### Create Test Products

1. Go to [Stripe Dashboard → Products](https://dashboard.stripe.com/test/products)
2. Create products with prices and images
3. Products will automatically appear on your site

#### Setup Webhook Forwarding (Development)

```bash
# Install Stripe CLI (if not already installed)
# macOS: brew install stripe/stripe-cli/stripe
# Linux: wget https://github.com/stripe/stripe-cli/releases/latest/download/stripe_1.32.0_linux_x86_64.tar.gz
#        tar -xzf stripe_1.32.0_linux_x86_64.tar.gz && sudo mv stripe /usr/local/bin/

# Login to Stripe
stripe login

# Forward webhooks to local server (keep this running during development)
stripe listen --forward-to localhost:5173/api/webhooks/stripe

# Copy the webhook signing secret (whsec_...) to your .env file
```

### 5. Start Development Server

```bash
# Start the dev server
npm run dev

# Open in browser
open http://localhost:5173
```

## Testing Payments

1. Add products to cart
2. Click checkout
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future expiry date and CVC
5. Complete payment
6. Check Stripe CLI output for webhook events
7. View order in Prisma Studio: `npx prisma studio`

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── Cart.svelte          # Shopping cart component
│   ├── server/
│   │   ├── db.ts                # Prisma client
│   │   └── stripe.ts            # Stripe client
│   └── stores/
│       └── cart.svelte.ts       # Cart state management (Svelte 5 runes)
├── routes/
│   ├── api/
│   │   ├── create-checkout-session/+server.ts  # Checkout API
│   │   └── webhooks/stripe/+server.ts          # Stripe webhooks
│   ├── checkout/
│   │   ├── success/+page.svelte # Success page
│   │   └── cancel/+page.svelte  # Cancel page
│   ├── +layout.svelte           # Root layout
│   ├── +page.svelte             # Home page with products
│   └── +page.server.ts          # Server-side product loading
prisma/
├── schema.prisma                # Database schema
└── migrations/                  # Database migrations
```

## Database Schema

- **Customer** - Customer information (email, name)
- **Order** - Order records with Stripe session IDs, payment status, addresses
- **OrderItem** - Individual items in orders with product details and pricing
- **OrderStatus** - Enum: PENDING, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED

## Deployment

### Production Checklist

1. **Switch to Production Stripe Keys**
   - Update `.env` with live keys from Stripe Dashboard

2. **Setup Production Webhook**
   - Add webhook endpoint in [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy webhook secret to production environment variables

3. **Database Migration**
   - Switch `DATABASE_URL` to PostgreSQL (recommended providers: Neon, Supabase, Railway)
   - Update `prisma/schema.prisma` datasource to `postgresql`
   - Run `npx prisma migrate deploy`

4. **Deploy**
   - Recommended: Vercel, Cloudflare Pages, or Netlify
   - Install appropriate adapter: `@sveltejs/adapter-vercel` or `@sveltejs/adapter-cloudflare`
   - Update `svelte.config.js` with chosen adapter

## Roadmap / TODOs

- [ ] Email confirmations (Resend integration ready)
- [ ] Customer authentication and accounts
- [ ] Order history pages
- [ ] Admin dashboard for order management
- [ ] Product search and filtering
- [ ] Inventory management
- [ ] Shipping rate calculations
- [ ] Tax calculations (Stripe Tax)

## Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Svelte 5 Runes](https://svelte-5-preview.vercel.app/docs/runes)
- [Stripe API Docs](https://stripe.com/docs/api)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## License

MIT
