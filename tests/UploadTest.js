import { Selector } from 'testcafe';

fixture `Example`
    .page `https://js.devexpress.com/Demos/WidgetsGallery/Demo/FileUploader/FileSelection/jQuery/Light/`;

test('Upload Files test', async t => {
    await t
        .switchToIframe('.demo-frame')
        .setFilesToUpload('.dx-fileuploader-input', ['../../upload/logo.png']);
});