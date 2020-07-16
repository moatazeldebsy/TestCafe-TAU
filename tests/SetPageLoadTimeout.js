fixture("Set page timout Fixture")
    .page("http://devexpress.github.io/testcafe/");

test("set page timout Test", async t =>{
    await t
    .setPageLoadTimeout(0)
    .navigateTo('http://devexpress.github.io/testcafe/');
});
