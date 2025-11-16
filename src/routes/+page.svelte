<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';
	import Cart from '$lib/components/Cart.svelte';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	interface Product {
		id: string;
		priceId: string;
		name: string;
		price: number;
		currency: string;
		images: string[];
		description?: string;
	}

	let { data }: { data: PageData & { products: Product[] } } = $props();

	onMount(() => {
		cart.loadFromLocalStorage();
	});

	function addToCart(product: any) {
		cart.addItem({
			priceId: product.priceId,
			productId: product.id,
			name: product.name,
			price: product.price,
			image: product.images[0]
		});
	}
</script>

<h1>Products</h1>

<div>
	<h2>Products</h2>
	{#if data.products.length === 0}
		<p>No products available. Make sure you have products set up in your Stripe dashboard.</p>
	{:else}
		<div>
			{#each data.products as product (product.id)}
				<div>
					<h3>{product.name}</h3>
					{#if product.images.length > 0}
						<img src={product.images[0]} alt={product.name} width="200" />
					{/if}
					<p>{product.description || 'No description'}</p>
					<p>${product.price.toFixed(2)} {product.currency.toUpperCase()}</p>
					<button onclick={() => addToCart(product)}>Add to Cart</button>
				</div>
			{/each}
		</div>
	{/if}
</div>

<Cart />
