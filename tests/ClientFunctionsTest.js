import { Selector } from 'testcafe';
import { ClientFunction } from 'testcafe';

fixture("Test Fixture with TestCafe")
    .page("https://devexpress.github.io/testcafe/example/");
    
    const developerName = Selector('#developer-name'); 
    const getPageURL = ClientFunction(() => window.location.href);

    test("Client Function Test with TestCafe", async t => {
        await t
            .expect(developerName.value).eql('','input is empty')
            .typeText(developerName,'TAU')
            .expect(developerName.value).eql('TAU','input contains "TAU"')
            .click('input#macos')
            .click('#submit-button') 
            .expect(getPageURL()).contains('thank-you');       
        });