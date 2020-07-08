import { Selector } from 'testcafe';

fixture `Example`
    .page `https://js.devexpress.com`;

test('Hover test', async t => {
    await t
        .hover('.map-container');
});