fixture("First Fixture with TestCafe")
    .page("https://devexpress.github.io/testcafe/example/");
test("First Test with TestCafe", async t => {
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