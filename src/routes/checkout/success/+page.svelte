<script lang="ts">
	import { onMount } from 'svelte';
	import { cart } from '$lib/stores/cart.svelte';

	onMount(() => {
		cart.clear();
	});
</script>

<h1>Order Successful!</h1>
<p>Thank you for your purchase. Your order has been confirmed.</p>
<p>You will receive an email confirmation shortly.</p>
<a href="/">Return to Home</a>
