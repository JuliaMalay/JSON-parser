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

    if (data.name) {
      const title = document.createElement('legend');
      title.classList.add('form__title');
      title.textContent = data.name;
      form.insertAdjacentElement('beforeend', title);
    }
    if (data.fields && data.fields.length) {
      data.fields.forEach((field, index) => {
        const wrapInput = document.createElement('p');
        form.insertAdjacentElement('beforeend', wrapInput);
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
      form.insertAdjacentElement('beforeend', wrapInput);
      const label = document.createElement('label');
      label.classList.add('label');
      wrapInput.insertAdjacentElement('beforeend', label);
      const link = document.createElement('a');
      link.classList.add('form__link');
      data.references.forEach((reference) => {
        if (reference.hasOwnProperty('input')) {
        }
        for (let el in reference) {
          if (el === 'input') {
            const input = document.createElement('input');
            input.classList.add('input');
            const params = reference[el];
            for (let param in params) {
              input.setAttribute(param, params[param]);
            }
            label.insertAdjacentElement('afterbegin', input);
          } else if (el === 'text without ref') {
            // label.textContent = reference[el];
            label.insertAdjacentText('beforeend', reference[el]);
          } else if (el === 'text') {
            link.textContent = reference[el];
            // link.setAttribute('href', '');
            label.insertAdjacentElement('beforeend', link);
          } else if (el === 'ref') {
            link.setAttribute('href', reference[el]);
          }
        }
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
