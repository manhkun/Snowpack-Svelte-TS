import { writable } from 'svelte/store';
import type { ICart } from 'Types/cart';
import type { ProductsUpsell, Settings, VariantStore } from 'Types/json';

const cartStore = writable<Partial<ICart>>({});
const listProductsStore = writable<ProductsUpsell[]>([]);
const listUpsellsStore = writable<number[]>([]);
const variantsOfferStore = writable<VariantStore[]>([]);
const settingsStore = writable<Settings>({} as Settings);
const ShopifyStore = writable({} as any);

export {
  cartStore,
  listProductsStore,
  listUpsellsStore,
  variantsOfferStore,
  ShopifyStore,
  settingsStore,
};
