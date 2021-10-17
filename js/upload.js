export function upload(selector, options = {}) {
  const inputUpload = document.querySelector(selector);

  const buttonOpen = document.createElement('button');
  buttonOpen.classList.add('button', 'main__button', 'button_primary');
  buttonOpen.textContent = 'Открыть';

  const buttonRemove = document.createElement('button');
  buttonRemove.classList.add('button', 'main__button');
  buttonRemove.textContent = 'Сбросить';

  const formContainer = document.createElement('div');
  formContainer.classList.add('form__wrapper');

  if (options.accept && Array.isArray(options.accept)) {
    inputUpload.setAttribute('accept', options.accept.join(','));
  }

  inputUpload.insertAdjacentElement('afterend', formContainer);
  inputUpload.insertAdjacentElement('afterend', buttonRemove);
  inputUpload.insertAdjacentElement('afterend', buttonOpen);

  const triggerInput = () => inputUpload.click();
  buttonOpen.addEventListener('click', triggerInput);

  const removeForm = () => (formContainer.innerHTML = ``);
  buttonRemove.addEventListener('click', removeForm);
  let parseData = {};

  const createForm = (data, container) => {
    const form = document.createElement('form');
    form.classList.add('form');
    container.insertAdjacentElement('afterbegin', form);

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('form__fieldset');
    form.insertAdjacentElement('afterbegin', fieldset);

    if (data.name) {
      const legend = document.createElement('legend');
      legend.classList.add('form__title');
      legend.textContent = data.name;
      fieldset.insertAdjacentElement('afterbegin', legend);
    }
    if (data.fields && data.fields.length) {
      data.fields.forEach((field, index) => {
        const formItem = document.createElement('p');
        formItem.classList.add('form__item');
        fieldset.insertAdjacentElement('beforeend', formItem);
        for (let el in field) {
          if (el === 'label') {
            const labelInput = document.createElement('label');
            labelInput.classList.add('label__input');
            labelInput.textContent = field[el];
            labelInput.setAttribute('for', `input${index}`);
            formItem.insertAdjacentElement('beforeend', labelInput);
          } else if (el === 'input') {
            const input = document.createElement('input');
            input.classList.add('input');
            input.setAttribute('id', `input${index}`);
            const params = field[el];
            for (let param in params) {
              input.setAttribute(param, params[param]);
            }
            formItem.insertAdjacentElement('beforeend', input);
          }
        }
      });
    }
    if (data.references && data.references.length) {
      const formItem = document.createElement('p');
      formItem.classList.add('form__item');
      fieldset.insertAdjacentElement('beforeend', formItem);

      data.references.forEach((reference) => {
        const label = document.createElement('label');

        if (!reference.hasOwnProperty('input')) {
          const link = document.createElement('a');
          link.classList.add('form__link');
          if (formItem.children.length) {
            if (reference['text without ref']) {
              formItem.firstChild.insertAdjacentText(
                'beforeend',
                reference['text without ref']
              );
            }
            formItem.firstChild.insertAdjacentElement('beforeend', link);
          } else {
            label.classList.add('label');
            formItem.insertAdjacentElement('beforeend', label);
            if (reference['text without ref']) {
              label.insertAdjacentText(
                'afterbegin',
                reference['text without ref']
              );
            }
            label.insertAdjacentElement('beforeend', link);
          }

          link.textContent = reference['text'];
          link.setAttribute('href', reference['ref']);
        } else {
          label.classList.add('check', 'option');
          formItem.insertAdjacentElement('beforeend', label);
          const input = document.createElement('input');
          input.classList.add('check__input');
          const params = reference['input'];
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
    if (data.buttons && data.buttons.length) {
      data.buttons.forEach((button) => {
        const formItem = document.createElement('p');
        formItem.classList.add('form__item');
        fieldset.insertAdjacentElement('beforeend', formItem);

        const formButton = document.createElement('button');
        formButton.classList.add('form__button');
        formButton.textContent = button.text;
        formItem.insertAdjacentElement('beforeend', formButton);
      });
    }
  };

  const changeHandler = (event) => {
    formContainer.innerHTML = ``;
    if (!event.target.files.length) {
      return;
    }
    const files = Array.from(event.target.files);
    let file = inputUpload.files[0];
    if (
      !file.type.match('application/json') &&
      !file.type.match('text/javascript')
    ) {
      return;
    }
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (ev) => {
      parseData = JSON.parse(ev.target.result);
      createForm(parseData, formContainer);
    };
  };

  inputUpload.addEventListener('change', changeHandler);
}
