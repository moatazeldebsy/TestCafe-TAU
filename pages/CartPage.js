import { Selector } from 'testcafe';

class CartPage{
    constructor() {
        this.termsLabel = Selector('input#termsofservice')
        this.cartTotal = Selector('td.cart-total-right')
        this.checkoutBtn = Selector('button#checkout.button-1.checkout-button')
    }
}
export default new CartPage();