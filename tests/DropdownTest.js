import {Selector} from 'testcafe';

const interfaceSelect = Selector('select#preferred-interface');
const interfaceOptions = interfaceSelect.find('option');

fixture("Select element from Dropdownlist")
.page("https://devexpress.github.io/testcafe/example/");

test('select element test', async t =>{
    await t
    .click(interfaceSelect)
    .click(interfaceOptions.withText('Both'));
});
