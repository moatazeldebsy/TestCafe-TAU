import { Selector } from 'testcafe';

class ProductDetailsPage{
    constructor() {
        this.productPrice = Selector("input[id='price-value-4']")
        this.prductQuantity = Selector('input#product_enteredQuantity_4.qty-input')
        this.addToCart = Selector("input[id='add-to-cart-button-4']")
        this.successMessage = Selector('div.bar-notification.success');
      }
    }
export default new ProductDetailsPage();