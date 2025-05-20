export function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export function calculateDiscount(price, typeDiscount, discount){
  if(typeDiscount == "0") {
    return price - (price * (discount / 100));
  }else {
    return price - discount;
  }
}