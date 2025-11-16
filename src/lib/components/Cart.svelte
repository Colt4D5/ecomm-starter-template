<script lang="ts">
	import { cart } from '$lib/stores/cart.svelte';

	let isOpen = $state(false);
	let isLoading = $state(false);

	function toggleCart() {
		isOpen = !isOpen;
	}

	async function checkout() {
		if (cart.items.length === 0) return;

		isLoading = true;
		try {
			const response = await fetch('/api/create-checkout-session', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					items: cart.items.map(item => ({
						priceId: item.priceId,
						quantity: item.quantity
					}))
				})
			});

			const data = await response.json();

			if (data.url) {
				window.location.href = data.url;
			} else {
				alert('Failed to create checkout session');
			}
		} catch (error) {
			console.error('Checkout error:', error);
			alert('An error occurred during checkout');
		} finally {
			isLoading = false;
		}
	}
</script>

<div>
	<button onclick={toggleCart}>
		Cart ({cart.itemCount})
	</button>

	{#if isOpen}
		<div>
			<h2>Shopping Cart</h2>
			
			{#if cart.items.length === 0}
				<p>Your cart is empty</p>
			{:else}
				<div>
					{#each cart.items as item (item.priceId)}
						<div>
							<div>
								{#if item.image}
									<img src={item.image} alt={item.name} width="50" />
								{/if}
								<div>
									<h3>{item.name}</h3>
									<p>${item.price.toFixed(2)}</p>
								</div>
							</div>
							<div>
								<button onclick={() => cart.updateQuantity(item.priceId, item.quantity - 1)}>-</button>
								<span>{item.quantity}</span>
								<button onclick={() => cart.updateQuantity(item.priceId, item.quantity + 1)}>+</button>
								<button onclick={() => cart.removeItem(item.priceId)}>Remove</button>
							</div>
							<p>${(item.price * item.quantity).toFixed(2)}</p>
						</div>
					{/each}
				</div>

				<div>
					<h3>Total: ${cart.total.toFixed(2)}</h3>
					<button onclick={checkout} disabled={isLoading}>
						{isLoading ? 'Processing...' : 'Checkout'}
					</button>
					<button onclick={() => cart.clear()}>Clear Cart</button>
				</div>
			{/if}

			<button onclick={toggleCart}>Close</button>
		</div>
	{/if}
</div>
