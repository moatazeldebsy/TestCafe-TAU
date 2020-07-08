import { Selector,t } from 'testcafe';

class CheckoutPage{
    constructor() { 
        this.countryList = Selector("select[id='BillingNewAddress_CountryId']")
        this.cityTxt = Selector("input[id='BillingNewAddress_City']")
        this.addressTxt = Selector("input[id='BillingNewAddress_Address1']")
        this.zipTxt = Selector("input[id='BillingNewAddress_ZipPostalCode']")
        this.phoneTxt = Selector("input[id='BillingNewAddress_PhoneNumber']")
        this.continueBtn = Selector('input.button-1.new-address-next-step-button')
        this.nextDayOption = Selector("input[id='shippingoption_1']")
        this.nextShippingBtn = Selector('input.button-1.shipping-method-next-step-button')
        this.nextPaymentBtn = Selector('input.button-1.payment-method-next-step-button')
        this.nextConfirmBtn = Selector('input.button-1.payment-info-next-step-button')
        this.confirmOrderBtn = Selector('input.button-1.confirm-order-next-step-button')
        this.orderConfirmationMessage = Selector('strong').withText('Your order has been successfully processed!')
        this.viewOrderDetailsLink = Selector('a').withText('Click here for order details.')
    }

    async selectCountry(country){
        const countryOption = this.countryList.find('option');
        await t
        .click(this.countryList)
        .click(countryOption.withText(country));
    }
}
export default new CheckoutPage();