
/* eslint-disable no-use-before-define */
 const FFV = (function () {
  let formInputs = [];
  let formState = {};

  function setFormState(newState) {
    formState = { ...formState, ...newState };
  }
  function getApi() {
    return publicFacingApi;
  }
  function captureElements() {
    return formInputs.map((element) => document.getElementById(element));
  }
  function handleInput(event) {
    const input = {
      [event.target.id]: event.target.value.trim(),
    };
    setFormState({ ...input });
    executeStrategies();
  }
  function listenForInput(dirtyElements) {
    dirtyElements.forEach((element) => {
      element.addEventListener('input', handleInput);
    });
  }
  function buildErrorList() {
    const errors = {};
    formInputs.forEach((input) => {
      errors[input] = [];
    });
    setFormState({ errors });
  }
  function initInputValues() {
    formInputs.forEach((input) => {
      setFormState({ [input]: '' });

      Object.defineProperty(publicFacingApi, `${input}Value`, {
        get() {
          return formState[input];
        },
      });
    });
    formState.isValid = false;
  }

  function executeStrategies() {
    // Ensure each id has a validation strategy
    // if any is missing inform the developer
    const missingStrategies = [];
    formInputs.forEach((id) => {
      const strategyExist = Object.prototype.hasOwnProperty.call(formState.strategies, id);
      if (!strategyExist) {
        missingStrategies.push(id);
      }
    });
    if (missingStrategies.length > 0) {
      console.error(`Validation strategies have not been set for the following ID's: \n${missingStrategies.join('\n')}`);
      return;
    }

    formInputs.forEach((input) => {
      // clear error values before each validation strategy
      formState.errors[input] = [];
      formState.strategies[input]();
    });
    displayErrorsHere(formState.showMessageId);
  }
  function validate() {
    const dirtyElements = captureElements();
    listenForInput(dirtyElements);
    executeStrategies();
  }

  function setStrategy(id, strategyFunction) {
    if (!formInputs.includes(id)) {
      console.error(`Your ID '${id}' was not found in the list of ID's to validate, please set them first`);
      return;
    }

    Object.defineProperty(publicFacingApi, `${id}Error`, {
      set(message) {
        formState.errors[id].push(message);
      },
    });

    const newStrategy = { [id]: strategyFunction.bind(publicFacingApi) };
    formState.strategies = { ...formState.strategies, ...newStrategy };
  }

  function getState() {
    return formState;
  }
  function displayErrorsHere(htmlID) {
    formState.showMessageId = htmlID;
    const errorBlock = document.getElementById(htmlID);
    errorBlock.style.wordWrap = 'break-work';
    errorBlock.style.whiteSpace = 'pre-wrap';

    if (!errorBlock) {
      return console.error('ID to display the error messages not found');
    }
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';

    // eslint-disable-next-line arrow-body-style
    formInputs.forEach((id) => {
      const oneTypeOfErrors = formState.errors[id];
      const li = document.createElement('li');
      oneTypeOfErrors.forEach((singleError) => {
        li.textContent = singleError;
        ul.appendChild(li);
      });
    });

    // clear html for each form validation
    errorBlock.replaceChildren();
    errorBlock.appendChild(ul);
  }
  const publicFacingApi = {
    getApi,
    validate,
    setStrategy,
    getState,
    displayErrorsHere,
  };
  Object.defineProperty(publicFacingApi, 'theseIDs', {
    set(listOfIDs) {
      formInputs = listOfIDs.split(',');
      buildErrorList();
      initInputValues();
    },
  });

  return publicFacingApi;
})();

module.exports = module.exports.default =FFV;


