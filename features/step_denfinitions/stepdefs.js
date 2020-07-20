const assert = require('assert');
const { Given, When, Then } = require('cucumber');
const registerpage = require('../../pages/RegisterPage');

const URL = 'https://demo.nopcommerce.com/register'; 
var randomNumber = Math.floor(Math.random() * 10000);
Given('I open the registration page', async function () {
  await testController.navigateTo(URL); 
});

  When('I select the gender', async function () {
    await testController
    .click(registerpage.RegisterPage.GenderButton()); 
  });

  When('I enter First Name {string}', async function (firtname) {
    await testController.typeText(registerpage.RegisterPage.Firstname(),firtname);
  });

  When('I enter Last Name {string}', async function (lastname) {
    await testController.typeText(registerpage.RegisterPage.Lastname(),lastname);
  });

  When('I select Date of Birth {string}', async function (day) {
    await testController.click(registerpage.RegisterPage.DateOfBirth());
    await testController.click(registerpage.RegisterPage.ListOption().withText(day))
  });

  When('I select Month of Birth {string}', async function (month) {
    await testController.click(registerpage.RegisterPage.MonthOfBirth());
await testController.click(registerpage.RegisterPage.ListOption().withText(month));
  });

  When('I select Year of Birth {string}', async function (year) {
    await testController.click(registerpage.RegisterPage.YearOfBirth());
    await testController.click(registerpage.RegisterPage.ListOption().withText(year));
  });

  When('I enter Email {string}', async function (email) {
    await testController.typeText(registerpage.RegisterPage.Email(),email+randomNumber+"@test.com");

  });

  When('I enter Password {string}', async function (password) {
        await testController.typeText(registerpage.RegisterPage.Password(),password);

  });

  When('I enter Confirm Password {string}', async function (password) {
     await testController.typeText(registerpage.RegisterPage.ConfirmPassword(),password);

  });
  When('I click register button', async function () {
    await testController.click(registerpage.RegisterPage.RegistrationButton()); 

  });

  Then('successfull message is displayed', async function () {
    await testController.expect(registerpage.RegisterPage.SuccessfullMessage().exists).ok;
  });