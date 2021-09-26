/* eslint-disable prefer-rest-params */
/* eslint-disable no-use-before-define */

export const FFV = (function () {
  const formInputs = [];
  let formState = {};
  const defaults = {};

  function initializeInput(id) {
    formInputs.push(id);
    buildErrorList(id);
    initInputValues(id);
  }

  function buildErrorList(id) {
    const newError = { [id]: [] };
    formState.errors = { ...formState.errors, ...newError };
  }
  function initInputValues(id) {
    setFormState({ [id]: '' });

    Object.defineProperty(FFV, `${id}Value`, {
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

  function listenToInputs(dirtyElements) {
    dirtyElements.forEach((element) => {
      element.addEventListener('input', evaluateInput);
    });
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

  function handleFailure() {
    if (formState.successStrategy) {
      formState.failureStrategy();
    }
  }

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
      this.removeEventListener('click', handleFormSubmit);
      formState.submitAction();
      stoplistening();
    }
  }

  function defaultEmailStrategy() {
    // eslint-disable-next-line no-useless-escape
    const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!FFV.emailValue) {
      FFV.emailError = '❌Email cannot be empty';
    }
    if (FFV.emailValue && !validEmailRegex.test(FFV.emailValue)) {
      FFV.emailError = '❌Email must be valid';
    }
  }
  function defaultDateOfBirthStrategy(minAge = 18) {
    const dob = new Date(FFV.dobValue).getTime();
    const today = new Date().getTime();

    if (!FFV.dobValue) {
      FFV.dobError = '❌Date of birth must be valid';
    }

    // 18yrs x 365days * 24hrs * 60 mins * 60 seconds * 1000 milliseconds
    // 365.25 for leap year considerations
    if (today - minAge * 365.25 * 24 * 60 * 60 * 1000 <= dob) {
      FFV.dobError = `❌Minimum age is ${minAge} years`;
    }
  }

  function defaultPasswordStrategy(min = 6, max = 15) {
    const passwordErrorMessage = `❌Password must contain:\n\t One uppercase letter\n\t One lowercase letter\n\t One digit\n\t Between ${min} to ${max} characters long`;

    const validPasswordRegex = new RegExp(String.raw`((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})`, 'i');

    if (!FFV.passwordValue) {
      FFV.passwordError = '❌Password cannot be empty';
    }
    if (FFV.passwordValue && !validPasswordRegex.test(FFV.passwordValue)) {
      FFV.passwordError = passwordErrorMessage;
    }
    if (FFV.passwordValue.length > max) {
      FFV.passwordError = passwordErrorMessage;
    }
  }
  /**
   * Validates email input fields based on the input field ID
   * @memberof FastFormValidator
   * @function onEmail
   * @param  {String} id email input ID
   * @return {FastFormValidator}
   */
  defaults.email = function (id) {
    setStrategyFor(id, defaultEmailStrategy);
    formState.strategies[`${id}Args`] = [...arguments];
    formState.strategies[id]();
    return FFV;
  };
  /**
   * Validates password input fields with a minimum and maximum character limit
   * based on the input field Id
   * it also enforces at least One upper case ,one lowercase and one digit.
   * default character limits are between 6 and 16 characters
   * @memberof FastFormValidator
   * @function onPassword
   * @param  {String} id Password input ID
   * @param  {Number} minLength Min password character length
   * @param  {Number} maxLength Max password character length
   * @return {FastFormValidator}
   */
  defaults.password = function (id, minLength = 6, maxLength = 15) {
    setStrategyFor(id, defaultPasswordStrategy);
    formState.strategies[`${id}Args`] = [...arguments].slice(1);
    formState.strategies[id]();
    return FFV;
  };

  /**
   * Validates date input fields with a minimum age limit based on the input
   * field Id
   * @memberof FastFormValidator
   * @function onDateOfBirth
   * @param  {String} id  Date of birth input ID
   * @param  {Number} age Minimum age allowed checked against today's date
   * @return {FastFormValidator}
   */
  defaults.dateOfBirth = function (id, age = 18) {
    setStrategyFor(id, defaultDateOfBirthStrategy);
    formState.strategies[`${id}Args`] = [...arguments].slice(1);
    formState.strategies[id]();
    return FFV;
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

  function formHasErrors() {
    let amountOfErrorsFound = 0;
    formInputs.forEach((inputId) => {
      amountOfErrorsFound += formState.errors[inputId].length;
    });
    return !!amountOfErrorsFound;
  }

  /**
   * Provide FastFormValidator with the ID of an input field and the respective
   * function to validate that input field
   * 
   * When an ID is passed, the ID is used as a prefix to create a getter
   * for the current input value and a setter using camelCase
   * to create a list of error messages to display to the user on invalid input
   * 
   * prefixValue & prefixError
   * 
   * Example:
   * ```html
   * <input type="text" class="form-control" id="username">
   * ```
   * ```js
   *  FFV.setStrategyFor('username', atLeastSix);
   * //returns the value of the input field to be tested
   *  FFV.usernameValue 
   * //sets this message in an array that will be shown if the input field 
   *  FFV.usernameError = "username must be..." 
   *  ```
   * Error messages are stored in an array and can be displayed all at one or 
   * one per invalid condition, here is a one at a time example:
   * 
   * ```js
   * function atLeastSix() {
          if (!this.usernameValue) {
              this.usernameError = '❌ username can not be empty';
          }
          if (this.usernameValue && this.usernameValue.length < 6) {
              this.usernameError = '❌Username must be at least 6 characters long';
          }
    }
    //Usage: passing only the function reference
    FFV.setStrategyFor('username', atLeastSix);
   * 
   * ```
   * 
   * @memberof FastFormValidator
   * @function setStrategyFor
   * @param  {String} id  Input field ID
   * @param  {Function} strategyFunction  Function to validate that input field
   * @return {FastFormValidator}
   * 
   *   
   * 

    
   */

  function setStrategyFor(id, strategyFunction) {
    initializeInput(id);
    if (!formInputs.includes(id)) {
      console.error(`Your ID '${id}' was not found in the list of ID's to validate, please set them first`);
      return;
    }

    Object.defineProperty(FFV, `${id}Error`, {
      set(message) {
        formState.errors[id].push(message);
      },
    });

    const newStrategy = { [id]: strategyFunction.bind(FFV) };
    formState.strategies = { ...formState.strategies, ...newStrategy };
    return FFV;
  }

  /**
   * @memberof FastFormValidator
   * @function onSubmitButton
   * @param  {String} id  Submit button ID
   * @param  {Function} submitAction Function to run when the user submits the form and the form has passed validation (no input errors)
   * @return {FastFormValidator}
   */
  function onSubmitButton(id, submitAction) {
    formState.submitAction = submitAction;
    const submitBtn = document.getElementById(id);
    submitBtn.addEventListener('click', handleFormSubmit);
    return FFV;
  }

  /**
   * @memberof FastFormValidator
   * @function displayErrorsHere
   * @param  {type} htmlID  ID of the HTML container element that will display the error messages
   * @return {FastFormValidator}
   */
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
    return FFV;
  }

  const onSuccess = {
    hideFeedback,
    removeFeedback,
    addClass,
    removeClass,
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

  /**
   * Hides the element that contains the feedback messages using
   *  css visibility property
   * @memberof FastFormValidator
   * @function onSuccess.hideFeedback
   * @return {FastFormValidator}
   */
  function hideFeedback() {
    const strategy = hide;
    formState.successStrategy = strategy.bind(FFV);
    formState.failureStrategy = show.bind(FFV);
    return FFV;
  }

  /**
   * Hides the element that contains the feedback messages using
   * css display property
   * @memberof FastFormValidator
   * @function onSuccess.removeFeedback
   * @return {FastFormValidator}
   */
  function removeFeedback() {
    const strategy = remove;
    formState.successStrategy = strategy.bind(FFV);
    formState.failureStrategy = display.bind(FFV);
    return FFV;
  }

  function addClassName() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.classList.add(formState.feedbackClassName);
  }
  function removeClassName() {
    const errorBlock = document.getElementById(formState.feedbackElement);
    errorBlock.classList.remove(formState.feedbackClassName);
  }

  /**
   * Adds a classname to the element that contains the feedback
   * messages on successful validation
   * @memberof FastFormValidator
   * @function onSuccess.addClass
   * @return {FastFormValidator}
   */
  function addClass(className) {
    formState.feedbackClassName = className;
    formState.successStrategy = addClassName.bind(FFV);
    formState.failureStrategy = removeClassName.bind(FFV);
    return FFV;
  }
  /**
   * Removes a classname to the element that contains the feedback
   * messages on successful validation
   * @memberof FastFormValidator
   * @function onSuccess.removeClass
   * @return {FastFormValidator}
   */
  function removeClass(className) {
    formState.feedbackClassName = className;
    formState.successStrategy = removeClassName.bind(FFV);
    formState.failureStrategy = addClassName.bind(FFV);
    return FFV;
  }

  /**
   * The last method that should be called  after setting strategies
   * for inputs or after using default strategies, it starts the validating
   * process by listening to input fields.
   * @memberof FastFormValidator
   * @function validate
   * @return {Boolean} true if the all fields have valid input, false otherwise
   */
  function validate() {
    setFormStatus(false);
    const dirtyElements = captureElements();
    listenToInputs(dirtyElements);
    executeStrategies();
    return getFormStatus();
  }

  /**
   * used as FFV is a streamlined solution to validate input fields.
   * @typedef {Object} FastFormValidator
   *
   * @property {Function}  onEmail - The default {@link #onemail email} field validator.
   * @property {Function}  onPassword - The default {@link #onpassword password} field validator.
   * @property {Function}  onDateOfBirth - The default {@link #ondateofbirth date} field validator.
   * @property {Function}  setStrategyFor - Creates a custom validator for a given input field.
   * @property {Function}  onSubmitButton - Executes a function when a **VALID** form is submitted.
   * @property {Function}  displayErrorsHere - The HTML container (usually a div)
   * that will show the list of feedback Messages.
   * @property {Object}  onSuccess - Contains two(2) ways to hide the feedback element
   * @property {Function}  onSuccess.removeFeedback - Hides the feedback element based on the display css property
   * @property {Function}  onSuccess.hideFeedback - Hides the feedback element based on the visibility css property
   * @property {Function}  validate - Starts the validating
   * process by listening for changes on input fields.
   * @example
   <!DOCTYPE html>
<html lang="en">
<head>
    <title>Your Form</title>
    <script defer type="module" src="UMD/ffv.min.js"></script>
    <script>

FFV.onEmail('email')
  .onPassword('password', 4, 22)
  .onDateOfBirth('dob', 18)
  .setStrategyFor('username', atLeastSix)
  .displayErrorsHere('showErrors')
  .onSuccess.removeFeedback()
  .onSubmitButton('submitBtn', hooray)
  .validate();

    </script>
</head>
<body>
    <!-- form here -->
</body>
</html>


//Usage on Node, just require the module
const { FFV } = require('fast-form-validator');


   *
   */
  return {
    onEmail: defaults.email,
    onPassword: defaults.password,
    onDateOfBirth: defaults.dateOfBirth,
    validate,
    setStrategyFor,
    onSubmitButton,
    onSuccess,
    displayErrorsHere,
    showState: function functionName() {
      return formState;
    },
  };
})();
