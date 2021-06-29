import axios from 'axios';

declare const Shopify: {
  shop: string;
  locale: string;
};

const shopName = Shopify.shop.replace('.myshopify.com', '');

let URL = `https://cdn.xopify.com/xo-cart-upsell/${shopName}`;

if (import.meta.env.SNOWPACK_PUBLIC_NODE_ENV === 'development') {
  URL = import.meta.env.SNOWPACK_PUBLIC_DEV ? '../upsell' : 'https://bundle.awe7.com/neo/quocmanh/upsell';
}

const axiosClient = axios.create({
  baseURL: URL,
  headers: {
    'content-type': 'applycation/json',
  },
});

axiosClient.interceptors.request.use(async (config) => config);

axiosClient.interceptors.response.use((response) => {
  if (response && response.data) {
    return response.data;
  }
  return response;
}, (error) => {
  throw error;
});

export default axiosClient;
