import { Selector,t,ClientFunction } from 'testcafe';

class HomePage{
    constructor() {
        this.subtitleHeader = Selector('h2').withText(
          'Welcome to our store'
        )
        this.RegisterLink = Selector('a').withText('Register')
        this.LoginLink = Selector('a').withText('Log in')
        this.CartLink = Selector('a').withText('Shopping cart')
        this.MyAccountLink = Selector('a').withText('My account')
        this.LogoutLink = Selector('a').withText('Log out');
        this.currenyList = Selector("input[id='customerCurrency']")
      }
      get productSearch() { return Selector("input[id='small-searchterms']"); } 
      
      async search(product) {
        await t.
        typeText(this.productSearch, product).
        wait(3000).
        pressKey('enter')
    }
    
      async changeCurrency(curreny){
        await t
        .click('select#customerCurrency')
        .click(Selector('option', { text: curreny }));
    }
}
export default new HomePage();