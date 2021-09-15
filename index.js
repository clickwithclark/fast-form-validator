
/* eslint-disable no-use-before-define */
export const FFV = (function () {
  let formInputs = [];
  let formState = {};
  let defaults = {};
  function defaultEmailStrategy(){
    
      // eslint-disable-next-line no-useless-escape
      const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!this.emailValue) {
        this.emailError = '❌Email cannot be empty';
      }
      if (this.emailValue && !validEmailRegex.test(this.emailValue)) {
        this.emailError = '❌Email must be valid';

  }}
  function defaultDateStrategy(minAge){
     // compare dates in milliseconds
     const dob = new Date(this.dobValue).getTime();
     const today = new Date().getTime();

     if (!this.dobValue) {
       this.dobError = '❌Date of birth must be valid';
     }
     if (this.dobValue && this.usernameValue.length < 6) {
       this.usernameError = '❌Username must be at least 6 characters long';
     }
     // 18yrs x 365days * 24hrs * 60 mins * 60 seconds * 1000 milliseconds
     // 365.25 for leap year considerations
     if (today - minAge * 365.25 * 24 * 60 * 60 * 1000 <= dob) {
       this.dobError = '❌Minimum age is 18 years';
     }

  }
  function defaultPasswordStrategy(min=6,max=15){
    
    
    const validPasswordRegex = new RegExp(`/((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})/`, 'i');
    if (!this.passwordValue) {
      this.passwordError = '❌Password cannot be empty';
    }
    if (this.passwordValue && !validPasswordRegex.test(this.passwordValue)) {
      this.passwordError =
        '❌Password must contain:\n One uppercase letter\n One lowercase letter\n One digit\n Between 6 to 15 characters long';
    }

  }

  defaults.email = function(id){
    formInputs.push(id);
    initializeInputs();
    setStrategy(id, defaultEmailStrategy);
    formState.strategies[`${id}Args`] =[...arguments];
    formState.strategies[id]();
    
  }
  //====================VVVVVV=====================
  defaults.password = function(id,minLength=6,maxLength=15){
    formInputs.push(id)
    initializeInputs();
    setStrategy(id, defaultPasswordStrategy);
    formState.strategies[`${id}Args`] =[...arguments].slice(1);
    formState.strategies[id]();
    
  }
  // defaults.minimumAge = function(id,age){
  //   formInputs.push(id)
  //   setStrategy(id, defaultDateStrategy)
  //   formState.strategies[id](age);
  //   formState.strategies[`${id}Args`] =arguments;
    
  // }

  

  function setFormState(newState) {
    formState = { ...formState, ...newState };
  }

  // function getApi() {
  //   return publicFacingApi;
  // }
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
 
  }

  function setStatus(status) {
    formState.isValid = status;
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
  }

  function executeStrategyOf(inputId) {
    formState.strategies[inputId](...argumentsFor(inputId));
  }
function argumentsFor(id){
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

  function validate() {
    const dirtyElements = captureElements();
    listenToInputs(dirtyElements);
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
    //remove
  function getState() {
    return formState;
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
    // getApi, remove
    defaults,
    getState,
    validate,
    setStrategy,
    displayErrorsHere
    
  };
  Object.defineProperty(publicFacingApi, 'theseIDs', {
    set(listOfIDs) {
      formInputs = listOfIDs.split(',');
      initializeInputs();
      setStatus(false);
    },
  });
  //remove
console.log(formState);
  return publicFacingApi;

  function initializeInputs() {
    buildErrorList();
    initInputValues();
  }
})();



 