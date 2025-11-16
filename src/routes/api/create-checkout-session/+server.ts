import { json, type RequestHandler } from '@sveltejs/kit';
import { stripe } from '$lib/server/stripe';
import { PUBLIC_APP_URL } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { items } = await request.json();

		const lineItems = items.map((item: { priceId: string; quantity: number }) => ({
			price: item.priceId,
			quantity: item.quantity
		}));

		const session = await stripe.checkout.sessions.create({
			line_items: lineItems,
			mode: 'payment',
			success_url: `${PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${PUBLIC_APP_URL}/checkout/cancel`
		});

		return json({ url: session.url });
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return json({ error: 'Failed to create checkout session' }, { status: 500 });
	}
};
