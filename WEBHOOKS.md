# Stripe Webhook Testing

## Local Development

To test webhooks locally, you need to use the Stripe CLI to forward webhook events to your local server.

### 1. Install Stripe CLI

**macOS (Homebrew):**
```bash
brew install stripe/stripe-cli/stripe
```

**Linux:**
```bash
# Download the latest Linux tar.gz file from https://github.com/stripe/stripe-cli/releases/latest
tar -xvf stripe_X.X.X_linux_x86_64.tar.gz
sudo mv stripe /usr/local/bin
```

**Windows:**
Download from https://github.com/stripe/stripe-cli/releases/latest

### 2. Login to Stripe CLI

```bash
stripe login
```

This will open your browser to authenticate with your Stripe account.

### 3. Forward Webhooks to Local Server

In a separate terminal, run:

```bash
stripe listen --forward-to http://localhost:5173/api/webhooks/stripe
```

This will output a webhook signing secret like `whsec_...`. Copy this value.

### 4. Update Environment Variable

Add the webhook secret to your `.env` file:

```
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret_from_stripe_cli
```

### 5. Test the Webhook

In another terminal, trigger a test checkout session completed event:

```bash
stripe trigger checkout.session.completed
```

You should see the webhook event logged in your terminal and a new order created in your database.

## Production

For production, configure webhooks in the Stripe Dashboard:

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen to:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the webhook signing secret and add it to your production environment variables

## Webhook Events Handled

- **checkout.session.completed** - Creates order in database when checkout is completed
- **payment_intent.succeeded** - Logged for reference
- **payment_intent.payment_failed** - Logged for reference

## Testing Workflow

1. Start your dev server: `npm run dev`
2. In another terminal: `stripe listen --forward-to http://localhost:5173/api/webhooks/stripe`
3. Make a test purchase on your site
4. Check the Stripe CLI output to see the webhook event
5. Verify the order was created in your database: `npx prisma studio`
