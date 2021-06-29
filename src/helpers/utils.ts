declare const xoUpsell: string;

const getUpdateTime = (): string => {
  let time = '';
  if (typeof xoUpsell !== 'undefined') {
    time = xoUpsell;
  } else {
    time = new Date().getTime().toString();
  }
  return time;
};

export { getUpdateTime };
