export interface Settings {
  type: 'vertical' | 'horizontal';
  isModal: boolean;
  color: string;
  title: string;
  addToCart?: string;
  addedToCart?: string;
  continueToCheckout: string;
  back: string;
  yourCart: string;
  discountLabel: string;
  icon: string;
  customCSS: string;
}
export interface ProductsUpsell {
  id: number;
  title: string;
  handle: string;
  image: string;
  price: number;
  totalInventory: number;
  description: string;
  variants: Variant[];
  idUpsell: number;
}

export interface Upsell {
  id: number,
  title: string,
  products: ProductsUpsell[],
  active: boolean,
  minimumPrice: number,
  maximumPrice: number
}

export interface Variant {
  id: number,
  public_title: string,
  description: string,
  price: number,
  quantity: number,
  isDiscount: boolean,
  amountOff: number,
  amountOffType: AmountOffType
}

export interface ProductTarget {
  idProducts: number[],
  idUpsell: number
}

export interface TrackOffers {
  event: EventTrackOffers
  shop: string,
  variant_id?: number,
  idUpsells?: number[],
}

export interface VariantOrder {
  variant_id: number,
  quantity: number
}

export interface VariantStore {
  idUpsell: number,
  products: ProductOffer[]
}

export interface VariantOffer {
  idUpsell: number,
  variants: VariantOrder[]
}

export interface ProductOffer {
  productId: number,
  variant: VariantOrder
}

export type AmountOffType = 'percentage' | 'amount';

export interface QuantityOffers {
  variant_id: number,
  quantity: number
}

export type EventTrackOffers = 'view' | 'addToCart' | 'removeCart' | 'close' | 'checkout';
