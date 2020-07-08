import { Selector } from 'testcafe';

const iframe = 'iframe#mce_0_ifr'
const textArea = 'body#tinymce.mce-content-body'

fixture `Example`
    .page `https://the-internet.herokuapp.com/iframe`;

test('Working With iframe test', async t => {
    await t
        .switchToIframe(iframe)
        .click(textArea)
        .pressKey('ctrl+a delete')
        .typeText(textArea,'Hello Test Automation University!')
        .expect(textArea).contains('Test')
        .switchToMainWindow();
});