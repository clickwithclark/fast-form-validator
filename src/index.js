class FastFormValidator {
  constructor() {
    // Instance-specific state
    this.formInputs = [];
    this.formState = {
      errors: {},
      strategies: {},
      feedbackElement: null,
      successStrategy: null,
      failureStrategy: null,
      submitAction: null,
      isValid: false,
      feedbackClassName: "",
    };
  }

  /**
   * Initialize an input field for validation
   */
  _initializeInput(id) {
    if (!this.formInputs.includes(id)) {
      this.formInputs.push(id);
      this.formState.errors[id] = [];
      this.formState[id] = "";

      // Create getter for input value
      Object.defineProperty(this, `${id}Value`, {
        get: () => this.formState[id],
        configurable: true,
      });

      // Create setter for errors
      Object.defineProperty(this, `${id}Error`, {
        set: (message) => {
          this.formState.errors[id].push(message);
        },
      });
    }
  }

  /**
   * Validate element exists
   */
  _getElement(id, type = "input") {
    const element = document.getElementById(id);
    if (!element) {
      throw new Error(`${type} element with id "${id}" not found`);
    }
    return element;
  }

  /**
   * Save input value
   */
  _saveInput(event) {
    this.formState[event.target.id] = event.target.value.trim();
  }

  /**
   * Execute all validation strategies
   */
  _executeStrategies() {
    // Check for missing strategies
    const missing = this.formInputs.filter(
      (id) => !this.formState.strategies[id],
    );

    if (missing.length) {
      throw new Error(`Missing strategies for inputs: ${missing.join(", ")}`);
    }

    // Clear errors and run strategies
    this.formInputs.forEach((id) => {
      this.formState.errors[id] = [];
      const strategy = this.formState.strategies[id];
      const args = this.formState.strategies[`${id}Args`];

      if (args) {
        strategy(...args);
      } else {
        strategy();
      }
    });

    // Update display
    this._displayErrors();

    // Check if form has errors
    const hasErrors = this.formInputs.some(
      (id) => this.formState.errors[id].length > 0,
    );

    this.formState.isValid = !hasErrors;

    if (hasErrors) {
      this._handleFailure();
    } else {
      this._handleSuccess();
    }
  }

  /**
   * Display errors in feedback element
   */
  _displayErrors() {
    if (!this.formState.feedbackElement) return;

    const errorBlock = this._getElement(
      this.formState.feedbackElement,
      "feedback",
    );

    errorBlock.style.wordWrap = "break-word";
    errorBlock.style.whiteSpace = "pre-wrap";

    const ul = document.createElement("ul");
    ul.style.listStyle = "none";

    this.formInputs.forEach((id) => {
      this.formState.errors[id].forEach((error) => {
        const li = document.createElement("li");
        li.textContent = error; // Safe from XSS
        ul.appendChild(li);
      });
    });

    errorBlock.replaceChildren(ul);
  }

  _handleSuccess() {
    if (this.formState.successStrategy) {
      this.formState.successStrategy();
    }
  }

  _handleFailure() {
    if (this.formState.failureStrategy) {
      this.formState.failureStrategy();
    }
  }

  /**
   * Public API: Set custom validation strategy
   */
  setStrategyFor(id, strategyFunction, ...args) {
    this._initializeInput(id);
    this.formState.strategies[id] = strategyFunction.bind(this);

    if (args.length > 0) {
      this.formState.strategies[`${id}Args`] = args;
    }

    return this;
  }

  /**
   * Public API: Validate email field
   */
  onEmail(id) {
    const emailStrategy = function (fieldId) {
      const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      const value = this[`${fieldId}Value`];

      if (!value) {
        this[`${fieldId}Error`] = "Email cannot be empty";
      } else if (!regex.test(value)) {
        this[`${fieldId}Error`] = "Email must be valid";
      }
    };

    return this.setStrategyFor(id, emailStrategy, id);
  }

  /**
   * Public API: Validate password field
   */
  onPassword(id, min = 6, max = 15) {
    const passwordStrategy = function (fieldId, minLen, maxLen) {
      const value = this[`${fieldId}Value`];
      const regex = new RegExp(
        `((?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{${minLen},${maxLen}})`,
        "i",
      );

      if (!value) {
        this[`${fieldId}Error`] = "Password cannot be empty";
      } else if (!regex.test(value) || value.length > maxLen) {
        this[`${fieldId}Error`] =
          `Password must contain:\n` +
          `\t One uppercase letter\n` +
          `\t One lowercase letter\n` +
          `\t One digit\n` +
          `\t Between ${minLen} to ${maxLen} characters`;
      }
    };

    return this.setStrategyFor(id, passwordStrategy, id, min, max);
  }

  /**
   * Public API: Validate date of birth
   */
  onDateOfBirth(id, minAge = 18) {
    const dobStrategy = function (fieldId, age) {
      const value = this[`${fieldId}Value`];

      if (!value) {
        this[`${fieldId}Error`] = "Date of birth must be valid";
        return;
      }

      const dob = new Date(value).getTime();
      const today = new Date().getTime();
      const minDate = today - age * 365.25 * 24 * 60 * 60 * 1000;

      if (minDate <= dob) {
        this[`${fieldId}Error`] = `Minimum age is ${age} years`;
      }
    };

    return this.setStrategyFor(id, dobStrategy, id, minAge);
  }

  /**
   * Public API: Display errors in element
   */
  displayErrorsHere(htmlID) {
    // Validate element exists immediately
    this._getElement(htmlID, "feedback container");
    this.formState.feedbackElement = htmlID;
    return this;
  }

  /**
   * Public API: Handle form submission
   */
  onSubmitButton(id, submitAction) {
    const submitBtn = this._getElement(id, "submit button");

    this.formState.submitAction = submitAction;

    const handleSubmit = (event) => {
      event.preventDefault();

      if (this.formState.isValid) {
        // Clean up
        submitBtn.removeEventListener("click", handleSubmit);
        this._stopListening();

        // Execute callback
        submitAction();
      }
    };

    submitBtn.addEventListener("click", handleSubmit);
    return this;
  }

  /**
   * Success/failure feedback handlers
   */
  get onSuccess() {
    return {
      hideFeedback: () => {
        this.formState.successStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.style.visibility = "hidden";
        };
        this.formState.failureStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.style.visibility = "visible";
        };
        return this;
      },

      removeFeedback: () => {
        this.formState.successStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.style.display = "none";
        };
        this.formState.failureStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.style.display = "block";
        };
        return this;
      },

      addClass: (className) => {
        this.formState.feedbackClassName = className;
        this.formState.successStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.classList.add(className);
        };
        this.formState.failureStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.classList.remove(className);
        };
        return this;
      },

      removeClass: (className) => {
        this.formState.feedbackClassName = className;
        this.formState.successStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.classList.remove(className);
        };
        this.formState.failureStrategy = () => {
          const el = this._getElement(this.formState.feedbackElement);
          el.classList.add(className);
        };
        return this;
      },
    };
  }

  /**
   * Start validation
   */
  validate() {
    this.formState.isValid = false;

    // Attach input listeners
    this.formInputs.forEach((id) => {
      const element = this._getElement(id);
      const handler = (e) => {
        this._saveInput(e);
        this._executeStrategies();
      };

      element.addEventListener("input", handler);

      // Store for cleanup
      element._ffvHandler = handler;
    });

    // Initial validation
    this._executeStrategies();

    return this.formState.isValid;
  }

  /**
   * Clean up event listeners
   */
  _stopListening() {
    this.formInputs.forEach((id) => {
      const element = document.getElementById(id);
      if (element && element._ffvHandler) {
        element.removeEventListener("input", element._ffvHandler);
        delete element._ffvHandler;
      }
    });
  }

  /**
   * Destroy instance
   */
  destroy() {
    this._stopListening();
    this.formInputs = [];
    this.formState = {
      errors: {},
      strategies: {},
      feedbackElement: null,
      successStrategy: null,
      failureStrategy: null,
      submitAction: null,
      isValid: false,
    };
  }
}

// Export for different module systems
export { FastFormValidator };

// Export default instance for backward compatibility
export const FFV = new FastFormValidator();

// UMD wrapper for browser (used by webpack)
if (typeof window !== "undefined") {
  window.FFV = FFV;
  window.FastFormValidator = FastFormValidator;
}
