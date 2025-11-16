import { json } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { db } from '$lib/server/db';
import { STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import type { RequestHandler } from './$types';
import type Stripe from 'stripe';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const signature = request.headers.get('stripe-signature');

	if (!signature) {
		return json({ error: 'No signature provided' }, { status: 400 });
	}

	let event: Stripe.Event;

	try {
		event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		console.error('Webhook signature verification failed:', err);
		return json({ error: 'Invalid signature' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed':
				await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
				break;

			case 'payment_intent.succeeded':
				console.log('Payment succeeded:', event.data.object.id);
				break;

			case 'payment_intent.payment_failed':
				console.log('Payment failed:', event.data.object.id);
				break;

			default:
				console.log(`Unhandled event type: ${event.type}`);
		}

		return json({ received: true });
	} catch (err) {
		console.error('Error processing webhook:', err);
		return json({ error: 'Webhook processing failed' }, { status: 500 });
	}
};

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
	console.log('Processing checkout session:', session.id);

	// Extract customer information
	const customerEmail = session.customer_details?.email;
	const customerName = session.customer_details?.name;

	if (!customerEmail) {
		console.error('No customer email in session');
		return;
	}

	// Get line items from the session
	const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
		expand: ['data.price.product']
	});

	// Create or update customer
	let customer = await db.customer.findUnique({
		where: { email: customerEmail }
	});

	if (!customer) {
		customer = await db.customer.create({
			data: {
				email: customerEmail,
				name: customerName || null
			}
		});
	}

	// Create order
	const order = await db.order.create({
		data: {
			stripeCheckoutId: session.id,
			stripePaymentId: session.payment_intent as string | null,
			customerId: customer.id,
			customerEmail: customerEmail,
			customerName: customerName || null,
			status: 'PAID',
			totalAmount: session.amount_total || 0,
			currency: session.currency || 'usd',
			shippingAddress: (session as any).shipping_details?.address
				? JSON.parse(JSON.stringify((session as any).shipping_details.address))
				: null,
			billingAddress: session.customer_details?.address
				? JSON.parse(JSON.stringify(session.customer_details.address))
				: null,
			orderItems: {
				create: lineItems.data.map((item) => {
					const product = item.price?.product as Stripe.Product;
					return {
						stripePriceId: item.price?.id || '',
						stripeProductId: typeof product === 'string' ? product : product?.id || '',
						productName: item.description || '',
						productImage: typeof product === 'object' ? product.images?.[0] : null,
						quantity: item.quantity || 1,
						pricePerUnit: item.price?.unit_amount || 0,
						totalPrice: (item.price?.unit_amount || 0) * (item.quantity || 1)
					};
				})
			}
		},
		include: {
			orderItems: true
		}
	});

	console.log('Order created:', order.id);
}
