export function upload(selector, options = {}) {
  const input = document.querySelector(selector);

  const open = document.createElement('button');
  open.classList.add('btn');
  open.textContent = 'Открыть';

  const remove = document.createElement('button');
  remove.classList.add('btn');
  remove.textContent = 'Сбросить';

  const formContainer = document.createElement('div');
  formContainer.classList.add('form__container');

  if (options.accept && Array.isArray(options.accept)) {
    input.setAttribute('accept', options.accept.join(','));
  }

  input.insertAdjacentElement('afterend', formContainer);
  input.insertAdjacentElement('afterend', remove);
  input.insertAdjacentElement('afterend', open);

  const triggerInput = () => input.click();
  open.addEventListener('click', triggerInput);

  const removeForm = () => (formContainer.innerHTML = ``);
  remove.addEventListener('click', removeForm);
  let parseData = {};

  const createForm = (data, container) => {
    const form = document.createElement('form');
    form.classList.add('form');
    container.insertAdjacentElement('afterbegin', form);

    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('form');
    form.insertAdjacentElement('afterbegin', fieldset);

    if (data.name) {
      const legend = document.createElement('legend');
      legend.classList.add('form__title');
      legend.textContent = data.name;
      fieldset.insertAdjacentElement('afterbegin', legend);
    }
    if (data.fields && data.fields.length) {
      data.fields.forEach((field, index) => {
        const wrapInput = document.createElement('p');
        fieldset.insertAdjacentElement('beforeend', wrapInput);
        for (let el in field) {
          if (el === 'label') {
            const label = document.createElement('label');
            label.classList.add('label');
            label.textContent = field[el];
            label.setAttribute('for', `input${index}`);
            wrapInput.insertAdjacentElement('beforeend', label);
          } else if (el === 'input') {
            const input = document.createElement('input');
            input.classList.add('input');
            input.setAttribute('id', `input${index}`);
            const params = field[el];
            for (let param in params) {
              input.setAttribute(param, params[param]);
            }
            wrapInput.insertAdjacentElement('beforeend', input);
          }
        }
      });
    }
    if (data.references && data.references.length) {
      const wrapInput = document.createElement('p');
      fieldset.insertAdjacentElement('beforeend', wrapInput);

      //------------------------------------popytka
      data.references.forEach((reference) => {
        const label = document.createElement('label');
        label.classList.add('label');
        if (!reference.hasOwnProperty('input')) {
          const link = document.createElement('a');
          link.classList.add('form__link');
          if (wrapInput.children.length) {
            if (reference['text without ref']) {
              wrapInput.firstChild.insertAdjacentText(
                'beforeend',
                reference['text without ref']
              );
            }
            wrapInput.firstChild.insertAdjacentElement('beforeend', link);
          } else {
            wrapInput.insertAdjacentElement('beforeend', label);
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
          wrapInput.insertAdjacentElement('beforeend', label);
          const input = document.createElement('input');
          input.classList.add('input');
          const params = reference['input'];
          for (let param in params) {
            input.setAttribute(param, params[param]);
          }
          label.insertAdjacentElement('afterbegin', input);
        }
      });
    }
    if (data.buttons && data.buttons.length) {
      data.buttons.forEach((button) => {
        const wrapButtons = document.createElement('p');
        fieldset.insertAdjacentElement('beforeend', wrapButtons);

        const formButton = document.createElement('button');
        formButton.classList.add('form__button');
        formButton.textContent = button.text;
        wrapButtons.insertAdjacentElement('beforeend', formButton);
      });
    }
  };

  const changeHandler = (event) => {
    formContainer.innerHTML = ``;
    if (!event.target.files.length) {
      return;
    }
    const files = Array.from(event.target.files);
    let file = input.files[0];
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

  input.addEventListener('change', changeHandler);
}
