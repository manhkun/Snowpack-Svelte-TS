import App from './App.svelte';
import { listProductsStore, cartStore, listUpsellsStore, ShopifyStore, settingsStore } from './store/index';
import type { ProductsUpsell, ProductTarget, Settings } from 'Types/json';
import type { ICart } from 'Types/cart';
import upsellAPI from './api/upsells.api';

declare let Shopify: any;
declare let xoUpsell: any;

const mainPage = document.querySelector('main.main-content');

mainPage?.insertAdjacentHTML('beforeend', '<div id="xo-cart-upsell" class="xo-cart-upsell"></div>');

if (!sessionStorage.getItem("upsellTarget") || !sessionStorage.getItem("xoUpsell") || Number(sessionStorage.getItem("xoUpsell")) !== xoUpsell) {
  upsellAPI.getAllUpsellsID().then(data => sessionStorage.setItem("upsellTarget", JSON.stringify(data)));
  sessionStorage.setItem("xoUpsell", xoUpsell);
}
export default class CartUpSell {
  private buttonCheckout: HTMLElement | null;

  private settings: Settings | undefined;

  private buttonVirtual: HTMLElement | undefined;

  constructor(el: HTMLElement | null) {
    this.buttonCheckout = el;
  }

  public async init(): Promise<void> {
    this.settings = await upsellAPI.getSettings();
    settingsStore.set(this.settings);

    this.buttonVirtual = this.buttonCheckout?.cloneNode(true) as HTMLElement;
    this.buttonVirtual.setAttribute('data-xo-upsell-button-virtual', '');
    this.makeVirtualButton().handleCheckUpsell();
  }

  public makeVirtualButton(): this {
    const { buttonVirtual, buttonCheckout } = this;
    const parentButton = buttonCheckout?.parentNode;

    // Add virtual button
    if (buttonCheckout?.nextSibling) {
      parentButton?.insertBefore(buttonVirtual as Node, buttonCheckout as Node);
    } else {
      parentButton?.appendChild(buttonVirtual as Node);
    }
    const styleBtn = buttonCheckout?.style;
    styleBtn!.display = 'none';
    return this;
  }

  private fetchData = async (): Promise<{cart: ICart, listProducts: ProductsUpsell[], listUpsells: number[]}> => {
    // List upsell
    const targets = JSON.parse(sessionStorage.getItem('upsellTarget') as string) as ProductTarget[];

    // Fetch data cart
    const resCart = await fetch('../cart.json');
    const cart = await resCart.json() as ICart;

    const listUpsells = this.getListUpsell(cart, targets);

    // Fetch data upsell
    const listProducts: ProductsUpsell[] = [];
    let productsIdUpsell = [] as number[];

    await Promise.all(
      listUpsells.map(async (upsellID) => {
        const upsell = await upsellAPI.getUpsellByID(upsellID);
        // Push unique product to list product upsell
        upsell.products.forEach(item => {
          /** Check xem trong khoang gia khong */
          const isInPriceRange = upsell.maximumPrice === null || (cart.total_price >= upsell.minimumPrice && cart.total_price <= upsell.maximumPrice);
          /** Neu active va upsell chua product id hoac nam trong khoang gia thi push vao list */
          if ((!productsIdUpsell.includes(item.id) && isInPriceRange) && upsell.active) {
            item.idUpsell = upsellID;
            listProducts.push(item);
            productsIdUpsell.push(item.id);
          }
        })
      })
    )

    return {cart, listProducts, listUpsells}
  }

  public async handleCheckUpsell(): Promise<void> {
    /** Neu ko phai la modal thi mount luon vao page cart  */
    if (!this.settings?.isModal && window.location.pathname === '/cart') {
      const {cart, listProducts, listUpsells} = await this.fetchData();

      if (listProducts.length) {
        // mount Svelte app to dom
        this.mountSvelte(cart, listProducts, listUpsells);
      }

      this.buttonVirtual?.addEventListener('click', (e) => {
        e.preventDefault();
        const buttonCheckout = document.querySelector('.upsell-container button.continue-to-checkout') as HTMLButtonElement;
        buttonCheckout.click();
      })
    } else {
      this.buttonVirtual?.addEventListener('click', async (e) => {
        e.preventDefault();
        const {cart, listProducts, listUpsells} = await this.fetchData();

        if (listProducts.length) {
            // mount Svelte app to dom
          this.mountSvelte(cart, listProducts, listUpsells);
        } else {
          window.location.pathname = "/checkout"
        }
      });
    }
  }

  private getListUpsell(cart: ICart, productTarget: ProductTarget[]): number[] {
    let listUpsell = new Set<number>();
    productTarget.forEach((target) => {
      cart.items.forEach((item) => {
        if (target.idProducts.includes(item.product_id)) {
          listUpsell.add(target.idUpsell)
        }
      });
    });

    return Array.from(listUpsell);
  }

  private mountSvelte(cart: ICart, listProducts: ProductsUpsell[], listUpsells: number[]): void {
    // Set data store
    cartStore.set(cart);
    listProductsStore.set(listProducts);
    listUpsellsStore.set(listUpsells);
    ShopifyStore.set(Shopify);
    // Initial Svelte
    const app = new App({
      target: document.getElementById('xo-cart-upsell') as Element,
      intro: true
    });
  }
}

const listButton = document.querySelectorAll('form[action="/cart"] button[type="submit"][name="checkout"], form[action="/cart"] input[type="submit"][name="checkout]') as NodeListOf<HTMLElement>;
listButton.forEach((button: HTMLElement) => {
  const newApp = new CartUpSell(button);
  newApp.init();
});
