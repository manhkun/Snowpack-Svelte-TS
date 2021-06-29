export interface ICart {
  token?: string;
  note?: string;
  attributes?: any;
  original_total_price?: number;
  total_price: number;
  total_discount?: number;
  total_weight?: number;
  item_count?: number;
  requires_shipping?: boolean;
  cart_level_discount_applications: any[];
  currency: string;
  items: ILineItem[];
  items_subtotal_price: number;
}

export interface ILineItem {
  id: number;
  properties?: any;
  quantity: number;
  variant_id: number;
  key?: string;
  title?: string;
  price?: number;
  line_price?: number;
  original_line_price?: number;
  total_discount?: number;
  discounts?: any[];
  discounted_price?: number;
  featured_image?: {
    alt: string,
    aspect_ratio: number;
    height: number;
    url: string;
    width: number;
  };
  sku?: any;
  grams?: number;
  vendor?: string;
  product_id: number;
  gift_card?: boolean;
  url?: string;
  image?: string;
  handle?: string;
  requires_shipping?: boolean;
  product_type?: string;
  product_title?: string;
  product_description?: string;
  variant_title?: string;
  variant_options?: string[];
  final_line_price?: number;
  line_level_discount_allocations?: any[];
  line_level_total_discount?: number;
  options_with_values?: {
    name: string;
    value: number;
  }[];
  original_price?: number;
  product_has_only_default_variant?: boolean;
  taxable: boolean;
}

export interface IProperty {
  [propsKey: string]: string|number;
}

export interface IItemsResponse {
  items: ILineItem[];
}
