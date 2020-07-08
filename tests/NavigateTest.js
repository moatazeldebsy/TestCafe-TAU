import { Selector } from 'testcafe';

fixture `Example`
    .page `https://devexpress.github.io/testcafe/example/`;

test('Navigate To URL test', async t => {
    await t
        .navigateTo('https://github.com/DevExpress/testcafe');
});