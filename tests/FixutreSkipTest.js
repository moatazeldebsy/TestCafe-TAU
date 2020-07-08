import { Selector } from 'testcafe'

const developerName = Selector('#developer-name');
const osOption = Selector('input#macos')
const submitButton = Selector('#submit-button')

fixture.skip("First Fixture with TestCafe")
    .page("https://devexpress.github.io/testcafe/");
test.page("https://devexpress.github.io/testcafe/example")("First Test with TestCafe", async t => {
    await t
        .typeText(developerName,'TAU')
        .click(osOption)
        .click(submitButton);
    });
    
test.page("https://devexpress.github.io/testcafe/example")("Skip Test with TestCafe", async t => {
    await t
     .typeText(developerName,'TAU')
     .click(osOption)
     .click(submitButton);
    });
