function upload(selector, options = {}) {
  console.log('start');

  const inputUpload = document.querySelector(selector);
  let label = inputUpload.parentNode,
    labelVal = label.innerHTML;
  //   let span = inputUpload.previousElementSibling;
  let span = document.createElement('span');
  inputUpload.insertAdjacentElement('afterend', span);
  //   const buttonOpen = document.createElement('button');
  //   buttonOpen.classList.add('button', 'main__button', 'button_primary');
  //   buttonOpen.textContent = 'Открыть';

  //   const buttonRemove = document.createElement('button');
  //   buttonRemove.classList.add('button', 'main__button');
  //   buttonRemove.textContent = 'Сбросить';

  //   const formContainer = document.createElement('div');
  //   formContainer.classList.add('form__wrapper');
  //   inputUpload.insertAdjacentElement('afterend', formContainer);

  // inputUpload.insertAdjacentElement('afterend', buttonRemove);
  // inputUpload.insertAdjacentElement('afterend', buttonOpen);

  if (options.multi) {
    inputUpload.setAttribute('multiple', true);
  }

  if (options.accept && Array.isArray(options.accept)) {
    inputUpload.setAttribute('accept', options.accept.join(','));
  }

  //   const removeForm = () => (formContainer.innerHTML = ``);
  //   buttonRemove.addEventListener('click', removeForm);
  //   let parseData = {};

  const changeHandler = (event) => {
    if (!event.target.files.length) {
      return;
    }
    // files.forEach((file) => {});

    const files = Array.from(event.target.files);
    let file = inputUpload.files[0];
    // if (
    //   !file.type.match('application/json') &&
    //   !file.type.match('text/javascript')
    // ) {
    //   return;
    // }
    var fileName = '';
    if (event.target.files && event.target.files.length > 1) {
      fileName = `${event.target.files.length} files selected`;
      console.log(fileName);
      console.log(event.target.files.length);
    } else fileName = event.target.value.split('\\').pop();

    if (fileName) {
      span.textContent = fileName;
      console.log(fileName);
    } else span.textContent = 'no files selected';
    if (options.json) {
      const formContainer = document.createElement('div');
      formContainer.classList.add('form__wrapper');

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

// const inputs = document.querySelectorAll('.inputfile');
// Array.prototype.forEach.call(inputs, function (input) {
//   console.log('start');

//   var label = input.nextElementSibling,
//     labelVal = label.innerHTML;

//   input.addEventListener('change', function (e) {
//     console.log('listen');

//     var fileName = '';
//     if (this.files) {
//       fileName = e.target.value.split('\\').pop();
//     }

//     if (fileName) {
//       label.querySelector('span').innerHTML = fileName;
//     } else {
//       label.innerHTML = labelVal;
//     }
//   });
// });
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
    legend.textContent = data.name.toUpperCase().split('_').join(' ');
    fieldset.insertAdjacentElement('afterbegin', legend);
  }
  if (data.fields && data.fields.length) {
    data.fields.forEach((field, index) => {
      const formItem = document.createElement('p');
      formItem.classList.add('form__item');
      fieldset.insertAdjacentElement('beforeend', formItem);
      const labelInput = document.createElement('label');
      labelInput.classList.add('label__input');
      formItem.insertAdjacentElement('beforeend', labelInput);
      for (let el in field) {
        if (el === 'label') {
          labelInput.insertAdjacentText('beforeend', field[el]);
          labelInput.setAttribute('for', `input${index}`);
        } else if (el === 'input') {
          const input1 = document.createElement('input');
          input1.classList.add('input');
          input1.setAttribute('id', `input${index}`);
          labelInput.insertAdjacentElement('beforeend', input1);
          const params = field[el];
          for (let param in params) {
            input1.setAttribute(param, params[param]);
            if (params[param] === 'checkbox') {
              labelInput.classList.add('check', 'option');
              input1.classList.add('check__input');
              const checkbox = document.createElement('span');
              checkbox.classList.add('check__box');
              labelInput.insertAdjacentElement('beforeend', checkbox);
              console.log('TYT');
            }
            if (params[param] === 'technology') {
              console.log('hello');
            }
            if (params[param] === 'color') {
              const datalist = document.createElement('datalist');
              datalist.setAttribute('id', 'colors');
              input1.setAttribute('list', 'colors');
              labelInput.insertAdjacentElement('beforeend', datalist);
              params['colors'].forEach((color) => {
                const option = document.createElement('option');
                option.insertAdjacentText('afterbegin', color);
                datalist.insertAdjacentElement('beforeend', option);
              });
            }
            if (params[param] === 'file') {
              console.log('file file');

              input1.classList.add('inputfile');

              upload(`#input${index}`, {
                multi: true,
                accept: ['.png', '.jpeg', '.pdf'],
                json: false,
              });
            }
          }

          //------------------------------------------------------------------------
          // label.classList.add('check', 'option');
          // formItem.insertAdjacentElement('beforeend', label);
          // const input = document.createElement('input');
          // input.classList.add('check__input');
          // const params = reference['input'];
          // for (let param in params) {
          //   input.setAttribute(param, params[param]);
          // }
          // label.insertAdjacentElement('afterbegin', input);
          // const checkbox = document.createElement('span');
          // checkbox.classList.add('check__box');
          // label.insertAdjacentElement('beforeend', checkbox);
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
