import { Selector } from "testcafe";

class LoginPage {
  constructor() {
    this.emailInput = Selector("#Email");
    this.passwordInput = Selector("#Password");
    this.submitButton = Selector("button.button-1.login-button"); //I changed "input" to "button"
    this.accountHeader = Selector("strong").withText("Returning Customer");
  }
}

export default new LoginPage();
