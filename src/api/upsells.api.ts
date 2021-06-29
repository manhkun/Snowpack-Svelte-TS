import type {
  VariantOrder,
  VariantOffer,
  ProductTarget,
  Upsell,
  Settings,
} from 'Types/json';
import axiosClient from './axios.base';

declare const xoUpsell: number;

const upsellAPI = {
  getSettings: (): Promise<Settings> => {
    const url = `/setting.json?${xoUpsell}`;
    return axiosClient.get(url);
  },
  getUpsellByID: (id: number): Promise<Upsell> => {
    const url = `/${id}.json?${xoUpsell}`;
    return axiosClient.get(url);
  },

  getAllUpsellsID: (): Promise<ProductTarget> => {
    const url = `/all.json?${xoUpsell}`;
    return axiosClient.get(url);
  },

  postCheckout: (variantsInCart: VariantOrder[], variantsOffer: VariantOffer[]): Promise<string> => {
    const url = '/apps/xo-upsell/order';
    return axiosClient.post(url, { variantsInCart, variantsOffer });
  },
};

export default upsellAPI;
