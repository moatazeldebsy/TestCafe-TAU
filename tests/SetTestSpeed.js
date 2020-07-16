fixture("First Fixture")
    .page("http://devexpress.github.io/testcafe/");

test.page("https://devexpress.github.io/testcafe/example/")
("First Test", async t =>{
    await t
        .setTestSpeed(0.1)
        .typeText("#developer-name","TAU")
        .click("#macos")
        .click("#submit-button");
});
