import { Selector } from "testcafe";

class MyOrderPage {
  constructor() {
    this.orders = Selector('a').withText('Orders');
    }
}

export default new MyOrderPage();
