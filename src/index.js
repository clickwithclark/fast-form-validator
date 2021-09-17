/* eslint-disable prefer-rest-params */
/* eslint-disable no-use-before-define */

export const FFV = (function () {
  const formInputs = [];
  let formState = {};
  const defaults = {};
  // formState.successStrategy = undefined;

  function handleSuccess() {
    if (formState.successStrategy) {
      formState.successStrategy();
    }
  }

  function stoplistening() {
    const cleanElements = captureElements();
    cleanElements.forEach((element) => {
      element.removeEventListener('input', evaluateInput);
    });
  }
  function handleFormSubmit(event) {
    event.preventDefault();
    if (getFormStatus()) {
      stoplistening();
      this.removeEventListener('click', handleFormSubmit);
      formState.submitAction();
    }
  }

  function onSubmitButton(id, submitAction) {
    formState.submitAction = submitAction;
    const submitBtn = document.getElementById(id);
    submitBtn.addEventListener('click', handleFormSubmit);
    return this;
  }
  function defaultEmailStrategy() {
    // eslint-disable-next-line no-useless-escape
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!this.emailValue) {
      this.emailError = '❌Email cannot be empty';
    }
    if (this.emailValue && !validEmailRegex.test(this.emailValue)) {
      this.emailError = '❌Email must be valid';
    }
  }
  function defaultDateOfBirthStrategy(minAge = 18) {
    const dob = new Date(this.dobValue).getTime();
    const today = new Date().getTime();

    if (!this.dobValue) {
      this.dobError = '❌Date of birth must be valid';
    }

    // 18yrs x 365days * 24hrs * 60 mins * 60 seconds * 1000 milliseconds
    // 365.25 for leap year considerations
    if (today - minAge * 365.25 * 24 * 60 * 60 * 1000 <= dob) {
      this.dobError = `❌Minimum age is ${minAge} years`;
    }
  }

  function defaultPasswordStrategy(min = 6, max = 15) {
    const passwordErrorMessage = `❌Password must contain:\n\t One uppercase letter\n\t One lowercase letter\n\t One digit\n\t Between ${min} to ${max} characters long`;

    const validPasswordRegex = new RegExp(String.raw`((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})`, 'i');

    if (!this.passwordValue) {
      this.passwordError = '❌Password cannot be empty';
    }
    if (this.passwordValue && !validPasswordRegex.test(this.passwordValue)) {
      this.passwordError = passwordErrorMessage;
    }
    if (this.passwordValue.length > max) {
      this.passwordError = passwordErrorMessage;
    }
  }

  defaults.email = function (id) {
    setStrategy(id, defaultEmailStrategy);
    formState.strategies[`${id}Args`] = [...arguments];
    formState.strategies[id]();
    return this;
  };

  defaults.password = function (id, minLength = 6, maxLength = 15) {
    setStrategy(id, defaultPasswordStrategy);
    formState.strategies[`${id}Args`] = [...arguments].slice(1);
    formState.strategies[id]();
    return this;
  };

  defaults.dateOfBirth = function (id, age = 18) {
    setStrategy(id, defaultDateOfBirthStrategy);
    formState.strategies[`${id}Args`] = [...arguments].slice(1);
    formState.strategies[id]();
    return this;
  };

  function setFormState(newState) {
    formState = { ...formState, ...newState };
  }

  function captureElements() {
    return formInputs.map((element) => document.getElementById(element));
  }
  function evaluateInput(event) {
    saveInput(event);
    executeStrategies();
  }
  function saveInput(event) {
    const input = {
      [event.target.id]: event.target.value.trim(),
    };
    setFormState({ ...input });
  }

  function listenToInputs(dirtyElements) {
    dirtyElements.forEach((element) => {
      element.addEventListener('input', evaluateInput);
    });
  }
  function buildErrorList(id) {
    const newError = { [id]: [] };
    formState.errors = { ...formState.errors, ...newError };
  }
  function initInputValues(id) {
    setFormState({ [id]: '' });

    Object.defineProperty(publicFacingApi, `${id}Value`, {
      get() {
        return formState[id];
      },
      configurable: true,
    });
  }

  function setFormStatus(isValid) {
    formState.isValid = isValid;
  }
  function getFormStatus() {
    return formState.isValid;
  }
  function handleFailure() {
    if (formState.successStrategy) {
      formState.failureStrategy();
    }
  }
  function executeStrategies() {
    if (hasMissingStrategies().length) {
      console.error(`Validation strategies have not been set for the following ID's: \n${hasMissingStrategies().join('\n')}`);
      return;
    }

    formInputs.forEach((inputId) => {
      formState.errors[inputId] = [];
      executeStrategyOf(inputId);
    });
    displayErrorsHere(formState.feedbackElement);
    if (formHasErrors()) {
      handleFailure();
      return setFormStatus(false);
    }
    handleSuccess();
    return setFormStatus(true);
  }

  function formHasErrors() {
    let amountOfErrorsFound = 0;
    formInputs.forEach((inputId) => {
      amountOfErrorsFound += formState.errors[inputId].length;
    });
    return !!amountOfErrorsFound;
  }

  function executeStrategyOf(inputId) {
    if (!argumentsFor(inputId)) {
      formState.strategies[inputId]();
      return;
    }
    formState.strategies[inputId](...argumentsFor(inputId));
  }
  function argumentsFor(id) {
    return formState.strategies[`${id}Args`];
  }
  function hasMissingStrategies() {
    const missingStrategies = [];
    formInputs.forEach((id) => {
      const strategyExist = Object.prototype.hasOwnProperty.call(formState.strategies, id);
      if (!strategyExist) {
        missingStrategies.push(id);
      }
    });
    return missingStrategies;
  }

  /**
   * Provide FastFormValidator with the ID of an input field and the respective function to validate that input field
   * @memberof FastFormValidator
   * @function setStrategy
   * @inner
   * @param  {String} id  ID of an input field
   * @param  {Function} strategyFunction  function to validate that input field
   * @return {FastFormValidator}  The FFV module
   */
  function setStrategy(id, strategyFunction) {
    initializeInput(id);
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
    return this;
  }
  const feedback = {
    hideFeedback,
    removeFeedback,
  };
  function hide() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.style.visibility = 'hidden';
  }
  function show() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.style.visibility = 'visible';
  }
  function display() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.style.display = 'block';
  }

  function remove() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.style.display = 'none';
  }

  function hideFeedback() {
    const strategy = hide;
    formState.successStrategy = strategy.bind(publicFacingApi);
    formState.failureStrategy = show.bind(publicFacingApi);
    return publicFacingApi;
  }

  // function showFeedback() {
  //   const strategy = show;
  //   formState.successStrategy = strategy.bind(publicFacingApi);
  //   return publicFacingApi;
  // }
  // function displayFeedback() {
  //   const strategy = display;
  //   formState.successStrategy = strategy.bind(publicFacingApi);
  //   return publicFacingApi;
  // }
  function removeFeedback() {
    const strategy = remove;
    formState.successStrategy = strategy.bind(publicFacingApi);
    formState.failureStrategy = display.bind(publicFacingApi);
    return publicFacingApi;
  }

  /**
   * The last method that should be called  after setting strategies
   *  for inputs or after using default strategies, it starts the validating
   * process
   * @memberof FastFormValidator
   * @function validate
   * @inner
   * @return {Boolean} true if the all fields have valid input, false otherwise
   */
  function validate() {
    setFormStatus(false);
    const dirtyElements = captureElements();
    listenToInputs(dirtyElements);
    executeStrategies();
    return getFormStatus();
  }

  function displayErrorsHere(htmlID) {
    formState.feedbackElement = htmlID;
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
      oneTypeOfErrors.forEach((singleError) => {
        const li = document.createElement('li');
        li.textContent = singleError;
        ul.appendChild(li);
      });
    });

    // clear html for each form validation
    errorBlock.replaceChildren();
    errorBlock.appendChild(ul);
    return this;
  }

  /**
   * used as FFV is a streamlined solution to validate input fields.
   * @typedef {Object} FastFormValidator
   *
   * @property {Function}  onEmail - The ID of the email input field.
   * @property {Function}  onPassword - The ID of the password input field.
   * @property {Function}  onDateOfBirth - The ID of the date input field.
   * @property {Function}  setStrategy - the ID of an input field and the respective function to validate that input.
   * @property {Function}  onSubmitButton - The ID of the form's submit button.
   * @property {Function}  displayErrorsHere - The ID of the HTML container
   * that will contain the list of feedback Messages.
   * @property {Function}  validate - starts the validating
   * process.
   *
   */
  const publicFacingApi = {
    onEmail: defaults.email,
    onPassword: defaults.password,
    onDateOfBirth: defaults.dateOfBirth,
    validate,
    setStrategy,
    onSubmitButton,
    feedback,
    displayErrorsHere,
    get getstate() {
      return formState;
    },
  };

  return publicFacingApi;

  function initializeInput(id) {
    formInputs.push(id);
    buildErrorList(id);
    initInputValues(id);
  }
})();
