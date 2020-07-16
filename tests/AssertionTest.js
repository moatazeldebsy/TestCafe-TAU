import {Selector} from 'testcafe';

const developerName = Selector("#developer-name");
const osOption = Selector("#macos");
const submitButton = Selector("#submit-button");

fixture("First Fixture")
    .page("https://devexpress.github.io/testcafe/example/");

test("First Test", async t => {
 await t
        .expect(developerName.value).eql('','input is empty')
        .typeText(developerName,"TAU")
        .expect(developerName.value).eql('TAU','input contains "TAU"')
        .click(osOption)
        .click(submitButton);
});
