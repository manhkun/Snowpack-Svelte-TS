<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import Product from 'Components/Product.svelte';
  import moneyFormat from 'Helpers/filter/moneyFormat';
  import {
    cartStore,
    listProductsStore,
    variantsOfferStore,
    ShopifyStore,
    settingsStore,
  } from '../store/index';
  import type {
    VariantOrder,
    Settings,
    VariantOffer,
    VariantStore,
  } from 'Types/json/index';
  import type { ICart } from 'Types/cart';

  let products = $listProductsStore;
  let settings: Settings = $settingsStore;
  let variantsOffer: VariantOffer[] = [];
  let cart: Partial<ICart> = $cartStore;
  let shopify = $ShopifyStore;
  let isPopup = true;
  let variantsInCart: VariantOrder[] = [];

  const unsubscribe = variantsOfferStore.subscribe((variantsStore) => {
    handleVariantOffer(variantsStore);
  });

  onMount(() => {
    cart.items?.forEach((item) => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { variant_id, quantity } = item;
      variantsInCart.push({ variant_id, quantity });
    });

    if (settings && settings.isModal) document.body.classList.add('xo-remove-scrolling');
  });

  onDestroy(() => {
    unsubscribe();
  });

  /** Handle checkout upsell */
  async function handleCheckout(variantsOffer: VariantOffer[] = []) {
    /** Data order */
    const order = {
      variantsInCart,
      variantsOffer,
      shop: shopify.shop,
    };

    if (settings.isModal) {
      isPopup = false;
      document.body.classList.remove('xo-remove-scrolling');
    }
    const buttonVirtual = document.querySelector('[data-xo-upsell-button-virtual]') as HTMLButtonElement;
    buttonVirtual.disabled = true;

    if (variantsOffer.length > 0) {
      /** Post data len server va redirect sang draft order */
      try {
        const res = await fetch('/apps/xo-upsell/order', {
          method: 'POST',
          headers: {
            'content-type': 'applycation/json',
          },
          body: JSON.stringify(order),
        });
        if (res.status === 200) {
          const url = await res.text();
          window.location.replace(url);
        } else throw new Error('Bad request');
      } catch (error) {
        window.location.pathname = '/checkout';
      }
    } else window.location.pathname = '/checkout';
  }

  /** Convert data tu store ve order */
  function handleVariantOffer(variants: VariantStore[]) {
    const variantsOfferTemp: VariantOffer[] = [];
    variants.forEach((variant) => {
      const variantOffer: VariantOffer = {
        idUpsell: 0,
        variants: [] as VariantOrder[],
      };
      variantOffer.idUpsell = variant.idUpsell;
      variant.products.forEach((product) => {
        variantOffer.variants?.push(product.variant);
      });
      variantsOfferTemp.push(variantOffer);
    });
    variantsOffer = variantsOfferTemp;
  }

  function handleEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' && isPopup && settings.isModal) {
      handleCheckout();
    }
  }
</script>

<svelte:window on:keydown={handleEsc} />

{#if isPopup && settings}
  <div
    transition:fade
    class="upsell-container"
    class:is-modal={settings.isModal}
    style="--xo-color-primary: {settings.color}"
    on:click|self={() => settings.isModal && handleCheckout()}
  >
    <div class="upsell-modal">
      {#if settings.title}
        <div class="modal-title">
          <h2>{settings.title}</h2>
          {#if settings.isModal}
            <span on:click={() => handleCheckout()}>&#10005;</span>
          {/if}
        </div>
      {/if}

      <div
        class="modal__list-product"
        class:is-vertical={settings.type === 'vertical'}
      >
        {#each products as product, i}
          <Product {product} {settings} />
        {/each}
      </div>

      {#if settings.isModal}
        <div class="your-cart">
          {#if settings.icon}
            <span class="icon">
              <img src={settings.icon} alt="" />
            </span>
          {/if}
          <span class="text">{settings.yourCart}</span>
          <span>{moneyFormat(Number(cart.total_price))}</span>
        </div>
      {/if}

      <button
        type="button"
        class="continue-to-checkout"
        style={settings.isModal ? '' : 'display: none'}
        on:click={() => handleCheckout(variantsOffer)}
        >{settings.continueToCheckout}</button
      >
    </div>
  </div>
{/if}

<style lang="scss">
  :global(.xo-remove-scrolling) {
    overflow: hidden;
  }
  .upsell-container {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;

    &.is-modal {
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba($color: #000000, $alpha: 0.6);
      z-index: 99999999;
    }
  }
  .upsell-modal {
    width: 700px;
    max-width: 90%;
    background-color: #fff;

    border-radius: 5px;

    padding-bottom: 20px;

    .modal-title {
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1px solid #ccc;
      text-transform: uppercase;

      padding: 15px 0;

      position: relative;

      span {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }

      h2 {
        text-align: center;
        font-size: 24px;
      }
    }

    .modal__list-product {
      max-height: 600px;
      overflow: auto;

      &.is-vertical {
        display: flex;
        margin: 0 10px;
      }
    }

    .your-cart {
      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 20px;

      border-top: 1px solid #ccc;

      .icon {
        width: 24px;
        height: 24px;
        margin-right: 10px;

        img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      }

      .text {
        margin-right: auto;
      }
    }

    button.continue-to-checkout {
      background-color: transparent;
      border: 2px solid var(--xo-color-primary);
      color: var(--xo-color-primary);
      text-transform: uppercase;
      font-weight: 700;

      float: right;
      margin-right: 20px;
      margin-left: 20px;
      padding: 20px 30px;
      cursor: pointer;
    }
  }
</style>
