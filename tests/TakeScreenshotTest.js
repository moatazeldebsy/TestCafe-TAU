import { Selector } from 'testcafe';

fixture `Example`
    .page `https://js.devexpress.com`;

test('Take Screenshot test', async t => {
    await t
        .takeScreenshot()
        .takeElementScreenshot('.map-container');
});