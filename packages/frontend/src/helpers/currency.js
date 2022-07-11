/* const dollars = new Intl.NumberFormat(`en-US`, {
    currency: currency,
    style: 'currency',
}).format(currency, num); */


export function currencyFormat(num) {
    const cur = new Intl.NumberFormat('en-ID', {
        currency: 'IDR',
        style:  'currency',
    }).format(num);

    return cur;
}