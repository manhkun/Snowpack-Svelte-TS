import * as currency from '@shopify/theme-currency';

declare let Shopify: any;

/**
 * Format money from Shopify theo money_format
 */

const moneyFormatWithCurrency = `${Shopify.currency.active}{{amount_no_decimals_with_comma_separator}}`;

const moneyFormat = (value: number | string): string => currency.formatMoney(Number(value), moneyFormatWithCurrency);

export default moneyFormat;
