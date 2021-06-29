<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type {
    EventTrackOffers,
    TrackOffers,
    Variant,
    VariantStore,
  } from 'Types/json';
  import { variantsOfferStore, ShopifyStore } from '../store/index';

  export let textAddtoCart = 'Add';
  export let textAddedToCart = 'Added';
  export let variant: Variant;
  export let productId = 0;
  export let upsellID = 0;

  const dispatch = createEventDispatcher();

  let isAdded = false;
  let variantsOffer = $variantsOfferStore;
  let shopify = $ShopifyStore;

  async function clickAddToCart(): Promise<void> {
    isAdded = !isAdded;
    let event: EventTrackOffers = isAdded ? 'addToCart' : 'removeCart';
    let data: TrackOffers = {
      event,
      shop: shopify.shop,
      variant_id: variant.id,
      idUpsells: [upsellID],
    };
    await fetch('/apps/xo-upsell/track', {
      method: 'POST',
      headers: {
        'content-type': 'applycation/json',
      },
      body: JSON.stringify(data),
    });
    updateVariantsOffer();
    dispatch('added', isAdded);
  }

  function updateVariantsOffer(): void {
    /** Data variant upsell */
    const upsellObj: VariantStore = {
      idUpsell: upsellID,
      products: [
        {
          productId,
          variant: {
            variant_id: variant.id,
            quantity: variant.quantity,
          },
        },
      ],
    };

    /** Neu khong co variant offer nao thi push vao */
    if (variantsOffer.length === 0 && isAdded) {
      variantsOffer.push(upsellObj);
    } else {
      variantsOffer.forEach((variantOffer) => {
        /** Neu da co upsell roi thi check xem co product chua */
        if (variantOffer.idUpsell === upsellObj.idUpsell) {
          /**
           * Vi moi product chi dc chon 1 variant nen khi add
           * thi se loc bo het product roi them lai
           * con remove thi thoi khoi add
           */
          variantOffer.products = variantOffer.products.filter((product) => product.productId !== productId);
          if (isAdded) {
            const [productAdd] = upsellObj.products;
            variantOffer.products.push(productAdd);
          }
          /** Neu chua co thi push upsell obj vao */
        } else {
          variantsOffer.push(upsellObj);
        }
      });
    }

    /** Set lai store */
    variantsOfferStore.set(variantsOffer);
  }
</script>

<button
  class="xo-btn xo-add-to-cart"
  class:xo-added-to-cart={isAdded}
  on:click={clickAddToCart}
  style="--add-to-cart: '{textAddtoCart}'; --added-to-cart: '{textAddedToCart}';"
>
  <span />
</button>

<style lang="scss" scoped>
  .xo-btn {
    width: 100%;
    padding: 10px;
    border: none;
    outline: none;
    background: var(--xo-color-primary);
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;

    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .xo-add-to-cart {
    span::before {
      content: var(--add-to-cart);
    }
  }

  .xo-added-to-cart {
    background-color: #ccc;
    span::before {
      content: var(--added-to-cart);
    }
  }
</style>
