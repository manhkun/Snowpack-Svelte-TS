<script lang="ts">
  import Button from 'Components/Button.svelte';
  import moneyFormat from 'Helpers/filter/moneyFormat';
  import type {
    AmountOffType,
    ProductsUpsell,
    Settings,
    Variant,
  } from 'Types/json/index';

  export let product: ProductsUpsell;
  export let settings: Partial<Settings>;

  let variantSelected: Variant = product.variants[0];
  let isAdded = false;

  function discountPrice(
    ext: AmountOffType,
    amountOff: number,
    price: number,
  ): string {
    switch (ext) {
      case 'percentage':
        return moneyFormat(price * (1 - amountOff / 100));
      case 'amount':
        return moneyFormat(price - amountOff);
      default: return '';
    }
  }

  function handleAdded(event: any) {
    console.log(product.id);
    isAdded = event.detail;
  }
</script>

<div class="modal__list-item" class:is-vertical={settings.type === 'vertical'}>
  <div class="item__image">
    <img src={product.image} alt="" />
    {#if variantSelected && variantSelected.quantity > 1}
      <span>{variantSelected.quantity}</span>
    {/if}
  </div>
  <div class="item__info">
    <div class="item__heading">
      <a href={`/products/${product.handle}`} target="_blank">
        <h3>{product.title}</h3>
      </a>
      <div class="item__money">
        {#if variantSelected && variantSelected.isDiscount}
          <h4 class="item__money--discount">
            {discountPrice(
              variantSelected.amountOffType,
              variantSelected.amountOff,
              variantSelected.price,
            )}
          </h4>
        {/if}
        <h4 class="item__money--original">{moneyFormat(variantSelected.price)}</h4>
      </div>
    </div>

    <div class="item__desc" style="font-size: 16px;">
      {@html variantSelected.description}
    </div>

    {#if product.variants && product.variants.length > 1}
      <div class="item__variant">
        <select bind:value={variantSelected} on:blur="{() => { variantSelected = variantSelected; }}" disabled={isAdded}>
          {#each product.variants as variant}
            <option value={variant}>{variant.public_title}</option>
          {/each}
        </select>
      </div>
    {/if}
  </div>

  <div class="item__addtocart">
    <Button textAddtoCart={settings.addToCart} textAddedToCart={settings.addedToCart} variant={variantSelected} productId={product.id} upsellID={product.idUpsell} on:added={handleAdded}/>
  </div>
</div>

<style lang="scss" scoped>
  .modal__list-item {
    display: flex;
    align-items: center;
    margin: 0 20px;
    padding: 20px 0;

    &:not(:last-child) {
      border-bottom: 1px solid #ccc;
    }
    .item__image {
      position: relative;
      margin-right: 10px;

      width: 100px;
      height: 100px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      span {
        position: absolute;
        top: -10px;
        left: -10px;

        background-color: var(--xo-color-primary);
        width: 20px;
        height: 20px;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .item__heading {
      width: fit-content;
      margin-bottom: 10px;

      .item__money {
        display: flex;
      }

      a {
        text-decoration: none;
        color: inherit;
      }
      h3 {
        font-size: 16px;
      }

      h4 {
        font-size: 14px;
        margin-right: 10px;
      }
      .item__money--discount ~ .item__money--original {
        text-decoration: line-through;
        color: #ccc;
      }
    }

    .item__addtocart {
      margin-left: auto;
    }
  }

  .modal__list-item.is-vertical {
    width: 200px;
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    margin: 0 10px;
    border-bottom: none;
    flex: none;

    .item__image {
      width: 100%;
      height: auto;
    }

    .item__heading {
      flex-direction: column-reverse;
      align-items: unset;
      h4 {
        margin-left: 0;
        margin-right: 10px;
      }
    }

    .item__info {
      margin-top: 10px;
    }

    .item__desc {
      display: none;
    }

    .item__addtocart {
      width: 100%;
      margin-top: 10px;
    }
  }

</style>
