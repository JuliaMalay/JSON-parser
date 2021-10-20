function upload(selector, options = {}) {
  const inputUpload = document.querySelector(selector);
  let label = inputUpload.parentNode,
    labelVal = label.innerHTML;
  const formContainer = document.createElement('div');
  formContainer.classList.add('form__wrapper');

  let span = document.createElement('span');
  span.innerText = `Choose a file...`;
  span.classList.add('file__name');
  inputUpload.insertAdjacentElement('afterend', span);

  if (options.multi) {
    inputUpload.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    inputUpload.setAttribute('accept', options.accept.join(','));
  }
  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }

    const files = Array.from(event.target.files);
    let file = inputUpload.files[0];
    var fileName = '';
    if (event.target.files && event.target.files.length > 1) {
      fileName = `${event.target.files.length} files selected`;
    } else fileName = event.target.value.split('\\').pop();

    if (fileName) {
      span.textContent = fileName;
    } else span.textContent = 'no files selected';
    if (options.json) {
      formContainer.innerHTML = '';
      label.insertAdjacentElement('afterend', formContainer);
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (ev) => {
        parseData = JSON.parse(ev.target.result);
        createForm(parseData, formContainer);
      };
    }
  };

  inputUpload.addEventListener('change', changeHandler);
}

upload('#upload', {
  multi: false,
  accept: ['.js', '.json'],
  json: true,
});

const createForm = (data, container) => {
  const form = document.createElement('form');
  form.classList.add('form');
  container.insertAdjacentElement('afterbegin', form);

  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('form__fieldset');
  form.insertAdjacentElement('afterbegin', fieldset);
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'name' && value) {
      const legend = document.createElement('legend');
      legend.classList.add('form__title');
      legend.textContent = data.name.toUpperCase().split('_').join(' ');
      fieldset.insertAdjacentElement('afterbegin', legend);
    }
    if (key === 'fields' && value.length) {
      Object.entries(value).forEach(([field, value], index) => {
        const formItem = document.createElement('p');
        formItem.classList.add('form__item');
        fieldset.insertAdjacentElement('beforeend', formItem);
        const labelInput = document.createElement('label');
        labelInput.classList.add('form__label');
        formItem.insertAdjacentElement('beforeend', labelInput);
        Object.entries(value).forEach(([element, value]) => {
          if (element === 'label') {
            labelInput.insertAdjacentText('beforeend', value);
            labelInput.setAttribute('for', `input${index}`);
          } else if (element === 'input') {
            let input1;
            if (value['type'] === 'technology') {
              input1 = document.createElement('select');
            } else {
              input1 = document.createElement('input');
            }
            input1.classList.add('form__input');
            input1.setAttribute('id', `input${index}`);
            labelInput.insertAdjacentElement('beforeend', input1);
            const attributes = [
              'type',
              'required',
              'checked',
              'placeholder',
              'multiple',
            ];
            Object.entries(value).forEach(([param, value]) => {
              if (attributes.includes(param)) {
                input1.setAttribute(param, value);
              }
            });
            if (value['type'] === 'checkbox') {
              labelInput.classList.add('check', 'option');
              input1.classList.add('check__input');
              const checkbox = document.createElement('span');
              checkbox.classList.add('check__box');
              labelInput.insertAdjacentElement('beforeend', checkbox);
            } else if (value['type'] === 'color') {
              const datalist = document.createElement('datalist');
              datalist.setAttribute('id', 'colors');
              input1.setAttribute('list', 'colors');
              labelInput.insertAdjacentElement('beforeend', datalist);
              value['colors'].forEach((color) => {
                const option = document.createElement('option');
                option.insertAdjacentText('afterbegin', color);
                datalist.insertAdjacentElement('beforeend', option);
              });
            } else if (value['type'] === 'file') {
              let format = [];
              if (value['filetype']) {
                format = value['filetype'].map((f) => '.' + f);
              }

              input1.classList.add('form__input_file');
              upload(`#input${index}`, {
                multi: value['multiple'],
                accept: format,
                json: false,
              });
            } else if (value['type'] === 'number') {
              input1.setAttribute('type', 'text');
              let selector = document.getElementById(`input${index}`);
              let im = new Inputmask(value['mask']);
              im.mask(selector);
            } else if (value['type'] === 'technology') {
              value['technologies'].forEach((tech) => {
                let option = document.createElement('option');
                option.textContent = tech;
                input1.insertAdjacentElement('beforeend', option);
                // if(value['multiply']){
                //   input1.setAttribute('multiply')
                // }
              });
            }
          }
        });
      });
    }
    if (key === 'references' && value.length) {
      console.log('in references');

      const formItem = document.createElement('p');
      formItem.classList.add('form__item');
      fieldset.insertAdjacentElement('beforeend', formItem);
      Object.entries(value).forEach(([reference, value]) => {
        console.log('in reference: ', value);
        const label = document.createElement('label');
        if (!value.hasOwnProperty('input')) {
          console.log('no have input');

          const link = document.createElement('a');
          link.classList.add('form__link');
          if (formItem.children.length) {
            if (value['text without ref']) {
              formItem.firstChild.insertAdjacentText(
                'beforeend',
                value['text without ref']
              );
            }
            formItem.firstChild.insertAdjacentElement('beforeend', link);
          } else {
            label.classList.add('label');
            formItem.insertAdjacentElement('beforeend', label);
            if (value['text without ref']) {
              label.insertAdjacentText('afterbegin', value['text without ref']);
            }
            label.insertAdjacentElement('beforeend', link);
          }

          link.textContent = value['text'];
          link.setAttribute('href', value['ref']);
        } else {
          label.classList.add('check', 'option');
          formItem.insertAdjacentElement('beforeend', label);
          const input = document.createElement('input');
          input.classList.add('check__input');
          const params = value['input'];
          for (let param in params) {
            input.setAttribute(param, params[param]);
          }
          label.insertAdjacentElement('afterbegin', input);
          const checkbox = document.createElement('span');
          checkbox.classList.add('check__box');
          label.insertAdjacentElement('beforeend', checkbox);
        }
      });
    }
    if (key === 'buttons' && value.length) {
      const formItem = document.createElement('p');
      formItem.classList.add('form__buttons');
      fieldset.insertAdjacentElement('beforeend', formItem);
      value.forEach((button) => {
        const formButton = document.createElement('button');
        formButton.classList.add('form__button');
        formButton.textContent = button.text;
        formItem.insertAdjacentElement('beforeend', formButton);
      });
    }
  });
};
