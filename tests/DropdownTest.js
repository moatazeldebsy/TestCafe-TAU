import { Selector } from 'testcafe';

fixture `Select element manipulation`
    .page `https://devexpress.github.io/testcafe/example/`;

const interfaceSelect = Selector('select#preferred-interface');
const interfaceOption = interfaceSelect.find('option');

test(`Select an option from the drop-down menu`, async t => {
    await t
        .maximizeWindow()
        .click(interfaceSelect)
        .click(interfaceOption.withText('Both'));
});
