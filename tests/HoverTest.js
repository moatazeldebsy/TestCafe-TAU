fixture("Hover Fixture")
.page("https://devexpress.github.io/testcafe/example/")
.beforeEach(async t =>{
    await t
     .maximizeWindow()
     .setPageLoadTimeout(0)
     .setTestSpeed(0.1);
});

test('Hover test', async t => {
    await t
        .hover('input#populate');
});
