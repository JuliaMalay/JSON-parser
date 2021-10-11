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
      const title = document.createElement('h2');
      title.classList.add('form__title');
      title.textContent = data.name;
      form.insertAdjacentElement('afterbegin', title);
    }
    if (data.fields && data.fields.length) {
      data.fields.forEach((field) => {
        if (field.hasOwnProperty('label')) {
          console.log('label');
          const label = document.createElement('label');
          label.classList.add('label');
          label.textContent = field;
        }
        // for (el in field) {
        //   if (el === input) {
        //     console.log('input');
        //   }
        //   const element = document.createElement(el);
        // }
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
      console.log(ev.target.result);
      parseData = JSON.parse(ev.target.result);
      console.log(parseData);
      createForm(parseData, formContainer);
    };
  };

  input.addEventListener('change', changeHandler);
}
