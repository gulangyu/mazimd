import * as SimpleMDE from 'simplemde';
import * as request from 'superagent';
import md2html from '../../../utils/md2html';
import config from '../../../config';

declare global {
  interface Window {
    Prism?: any,
  }
}

function createNewPage(content, callback) {
  request
    .post(`${config.api_origin}/pages`)
    .send({ content })
    .end((err, res) => {
      if (err) {
        return callback(err);
      }
      callback(null, res.body);
    });
}

const textareaElement = <HTMLTextAreaElement>document.getElementById('mazimd-textarea');

const simplemde = new SimpleMDE({
  autoDownloadFontAwesome: false,
  autofocus: true,
  autosave: {
    enabled: true,
    uniqueId: 'mazimd',
  },
  element: document.getElementById('mazimd-textarea'),
  indentWithTabs: false,
  initialValue: '# Hello World',
  insertTexts: {
    image: ['![](http://', ')']
  },
  placeholder: 'Type markdown here',
  spellChecker: false,
  status: false,
  styleSelectedText: false,
  toolbar: [
    'bold',
    'italic',
    'strikethrough',
    '|',
    'heading',
    'code',
    'quote',
    'unordered-list',
    'ordered-list',
    '|',
    'link',
    'image',
    'table'
  ]
});

if (textareaElement.value !== '') {
  simplemde.value(textareaElement.value);
}

document.getElementById('mazimd-preview-button').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('mazimd-preview-content').innerHTML = md2html(window.Prism)(simplemde.value()).html;
  document.body.classList.add('mazimd-preview-mode');
});

document.getElementById('mazimd-preview-back-button').addEventListener('click', (e) => {
  e.preventDefault();
  document.body.classList.remove('mazimd-preview-mode');
});

document.getElementById('mazimd-publish-button').addEventListener('click', (e) => {
  e.preventDefault();
  if (confirm('确定发布吗？')) {
    createNewPage(simplemde.value(), (err, data) => {
      if (err) {
        return alert(err.message);
      }
      location.href = data.html_url;
    });
  }
})
