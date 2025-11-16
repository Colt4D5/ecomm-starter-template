import type Stripe from 'stripe';

export type CartItem = {
	priceId: string;
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
};

class CartStore {
	items = $state<CartItem[]>([]);

	get total(): number {
		return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
	}

	get itemCount(): number {
		return this.items.reduce((sum, item) => sum + item.quantity, 0);
	}

	addItem(product: { priceId: string; productId: string; name: string; price: number; image?: string }) {
		const existingItem = this.items.find(item => item.priceId === product.priceId);
		
		if (existingItem) {
			existingItem.quantity += 1;
		} else {
			this.items.push({
				...product,
				quantity: 1
			});
		}
		
		this.saveToLocalStorage();
	}

	removeItem(priceId: string) {
		this.items = this.items.filter(item => item.priceId !== priceId);
		this.saveToLocalStorage();
	}

	updateQuantity(priceId: string, quantity: number) {
		const item = this.items.find(item => item.priceId === priceId);
		if (item) {
			if (quantity <= 0) {
				this.removeItem(priceId);
			} else {
				item.quantity = quantity;
				this.saveToLocalStorage();
			}
		}
	}

	clear() {
		this.items = [];
		this.saveToLocalStorage();
	}

	private saveToLocalStorage() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('cart', JSON.stringify(this.items));
		}
	}

	loadFromLocalStorage() {
		if (typeof window !== 'undefined') {
			const saved = localStorage.getItem('cart');
			if (saved) {
				this.items = JSON.parse(saved);
			}
		}
	}
}

export const cart = new CartStore();
