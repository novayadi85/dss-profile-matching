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

export function toFixedNumber(num, digits, base){
    var pow = Math.pow(base||10, digits);
    return Math.round(num*pow) / pow;
}