import { Selector, t } from 'testcafe';

fixture `Example`
.page `https://devexpress.github.io/testcafe/example/`;

test('Drag test', async t => {
    const triedCheckbox = Selector('label').withText('I have tried TestCafe');

    await t
        .click(triedCheckbox)
        .drag('#slider', 360, 0, { offsetX: 10, offsetY: 10 });
});

