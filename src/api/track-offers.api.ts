import type { TrackOffers } from 'Types/json';
import axiosClient from './axios.base';

const trackOffersAPI = {
  postEvent: (args: TrackOffers): Promise<void> => {
    const url = '/apps/xo-upsell/track';
    const {
      event,
      shop,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      variant_id,
      idUpsells,
    } = args;
    const data: Partial<TrackOffers> = {
      event,
      shop,
      variant_id,
      idUpsells,
    };
    return axiosClient.post(url, data);
  },
};

export default trackOffersAPI;
