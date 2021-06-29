<script lang="ts">
  import PopUp from "Components/PopUp.svelte";
  import { onMount } from "svelte";
  import type { TrackOffers } from "Types/json";
  import { listUpsellsStore, ShopifyStore } from "./store";

  let idUpsells = $listUpsellsStore;
  let shopify = $ShopifyStore;

  onMount(async () => {
    const trackOffers: TrackOffers = {
      event: "view",
      shop: shopify.shop,
      idUpsells,
    };
    // const res = await trackOffersAPI.postEvent(trackOffers);
    await fetch('/apps/xo-upsell/track', {
      method: 'POST',
      headers: {
        'content-type': 'applycation/json',
      },
      body: JSON.stringify(trackOffers)
    })
  });

</script>

<main class="xo-cart-upsell">
  <PopUp />
</main>

<style lang="scss" global>
  .xo-cart-upsell * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  .xo-cart-upsell h1, .xo-cart-upsell h2, .xo-cart-upsell
      h3, .xo-cart-upsell h4, .xo-cart-upsell h5, .xo-cart-upsell h6 {
    text-transform: uppercase;
    font-weight: 600;
  }

</style>
