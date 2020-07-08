fixture.meta('version','1')("First Fixture with TestCafe")
    .page("https://devexpress.github.io/testcafe/example/");
test.meta('env', 'production')("First Test with TestCafe", async t => {
    await t
        .typeText('#developer-name','TAU')
        .click('input#macos')
        .click('#submit-button');
    });

test("Second Test with TestCafe", async t => {
    await t
        .typeText('#developer-name','TAU')
        .click('input#macos')
        .click('#submit-button');
        });

fixture.meta('version','2')("Fixture with TestCafe")
        .page("https://devexpress.github.io/testcafe/example/");
test.meta('env', 'production')("First Test with TestCafe", async t => {
        await t
            .typeText('#developer-name','TAU')
            .click('input#macos')
            .click('#submit-button');
        });
    
test("Second Test with TestCafe", async t => {
        await t
            .typeText('#developer-name','TAU')
            .click('input#macos')
            .click('#submit-button');
            });