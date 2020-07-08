import { Selector } from 'testcafe';

fixture `Example`
    .page `https://js.devexpress.com`;

test('Wait test', async t => {
    await t
        .hover('.map-container')
        .wait(1000);
});