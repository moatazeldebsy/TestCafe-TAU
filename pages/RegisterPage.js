import { Selector,t } from "testcafe";

class RegisterPage{
    constructor() {
        this.GenderOption = Selector('#gender-male')
        this.FirstName = Selector('#FirstName')
        this.LastName = Selector('#LastName')
        this.DateOfBirthDayList = Selector("select[name='DateOfBirthDay']")
        this.DateOfBirthMonthList = Selector("select[name='DateOfBirthMonth']")
        this.DateOfBirthYearList = Selector("select[name='DateOfBirthYear']")
        this.Email = Selector('#Email')
        this.Password = Selector('#Password')
        this.ConfirmPassword = Selector('#ConfirmPassword')
        this.RegisterButton = Selector('#register-button.button-1.register-next-step-button')
        this.SuccessfullMessage = Selector('div.result').withText('Your registration completed');
      }

      async selectDay(day){
        const DaysOption = this.DateOfBirthDayList.find('option');
        await t
        .click(this.DateOfBirthDayList)
        .click(DaysOption.withText(day));
    }

    async selectMonth(month){
      const DaysOption = this.DateOfBirthMonthList.find('option');
      await t
      .click(this.DateOfBirthMonthList)
      .click(DaysOption.withText(month));
  }

  async selectYear(year){
    const DaysOption = this.DateOfBirthYearList.find('option');
    await t
    .click(this.DateOfBirthYearList)
    .click(DaysOption.withText(year));
}
}
export default new RegisterPage();