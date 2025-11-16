import { stripe } from '$lib/server/stripe';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	try {
		const products = await stripe.products.list({
			active: true,
			expand: ['data.default_price']
		});

		const productsWithPrices = products.data.map((product) => {
			const price = product.default_price;
			const priceData = typeof price === 'string' ? null : price;

			return {
				id: product.id,
				name: product.name,
				description: product.description,
				images: product.images,
				priceId: priceData?.id || '',
				price: priceData?.unit_amount ? priceData.unit_amount / 100 : 0,
				currency: priceData?.currency || 'usd'
			};
		});

		return {
			products: productsWithPrices
		};
	} catch (error) {
		console.error('Error fetching products:', error);
		return {
			products: []
		};
	}
};
