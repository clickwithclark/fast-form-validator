
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
  function defaultDateOfBirthStrategy(minAge=18){
     // compare dates in milliseconds
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
  function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}
  function defaultPasswordStrategy(min=6,max=15){
    let passwordErrorMessage =`❌Password must contain:\n One uppercase letter\n One lowercase letter\n One digit\n Between ${min} to ${max} characters long`;
    
    const validPasswordRegex = new RegExp(String.raw`((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})`, 'i');
   
 
    if (!this.passwordValue) {
      this.passwordError = '❌Password cannot be empty';
    }
    if (this.passwordValue && !validPasswordRegex.test(this.passwordValue)) {
 
      this.passwordError =passwordErrorMessage
        
    }
    if (this.passwordValue.length>max) {
      this.passwordError= passwordErrorMessage;
      
    }

  }

  defaults.email = function(id){
    formInputs.push(id);
    initializeInput(id);
    setStrategy(id, defaultEmailStrategy);
    formState.strategies[`${id}Args`] =[...arguments];
    formState.strategies[id]();
    
  }

  defaults.password = function(id,minLength=6,maxLength=15){
    formInputs.push(id)
    initializeInput(id);
    setStrategy(id, defaultPasswordStrategy);
    formState.strategies[`${id}Args`] =[...arguments].slice(1);
    formState.strategies[id]();
    
  }
  //====================VVVVVV=====================

  defaults.minimumAge = function(id,age=18){
    formInputs.push(id)
    initializeInput(id);
    setStrategy(id, defaultDateOfBirthStrategy)
    formState.strategies[`${id}Args`]  =[...arguments].slice(1);
    formState.strategies[id]();
    
  }

  

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
  function buildErrorList(id) {
      let newError ={[id]:[]}
      formState.errors = {...formState.errors,...newError}
  
  }
  function initInputValues(id) {
      setFormState({ [id]: '' });

      Object.defineProperty(publicFacingApi, `${id}Value`, {
        get() {
          return formState[id];
        },
        configurable:true
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
    if (!argumentsFor(inputId)) {
      formState.strategies[inputId]();
      return;
    }
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
      oneTypeOfErrors.forEach((singleError) => {
        const li = document.createElement('li');
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
      console.log({formInputsB4:formInputs});
      formInputs = [...formInputs,...listOfIDs.split(',')];
      
      console.log({formInputsAfter:formInputs});
      formInputs.forEach((inputId) =>   initializeInput(inputId) );
      setStatus(false);
    },
  });
  //remove
  return publicFacingApi;

  function initializeInput(id) {
    buildErrorList(id);
    initInputValues(id);
  }
})();



 