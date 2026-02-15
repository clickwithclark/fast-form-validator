/**
 * TypeScript definitions for fast-form-validator
 * Provides full type safety and IntelliSense support
 */

export interface ValidationStrategy {
  (this: FastFormValidator, ...args: any[]): void;
}

export interface SuccessHandlers {
  /**
   * Hide feedback element using CSS visibility property
   */
  hideFeedback(): FastFormValidator;
  
  /**
   * Hide feedback element using CSS display property
   */
  removeFeedback(): FastFormValidator;
  
  /**
   * Add a class to feedback element on success
   */
  addClass(className: string): FastFormValidator;
  
  /**
   * Remove a class from feedback element on success
   */
  removeClass(className: string): FastFormValidator;
}

export class FastFormValidator {
  /**
   * Create a new form validator instance
   */
  constructor();

  /**
   * Validate an email input field
   * @param id - The HTML element ID of the email input
   * @returns The validator instance for chaining
   */
  onEmail(id: string): this;

  /**
   * Validate a password input field
   * @param id - The HTML element ID of the password input
   * @param minLength - Minimum password length (default: 6)
   * @param maxLength - Maximum password length (default: 15)
   * @returns The validator instance for chaining
   */
  onPassword(id: string, minLength?: number, maxLength?: number): this;

  /**
   * Validate a date of birth input field
   * @param id - The HTML element ID of the date input
   * @param minAge - Minimum required age (default: 18)
   * @returns The validator instance for chaining
   */
  onDateOfBirth(id: string, minAge?: number): this;

  /**
   * Set a custom validation strategy for an input field
   * @param id - The HTML element ID of the input
   * @param strategyFunction - The validation function to execute
   * @param args - Additional arguments to pass to the strategy function
   * @returns The validator instance for chaining
   */
  setStrategyFor(
    id: string,
    strategyFunction: ValidationStrategy,
    ...args: any[]
  ): this;

  /**
   * Specify where error messages should be displayed
   * @param htmlID - The HTML element ID of the error container
   * @returns The validator instance for chaining
   */
  displayErrorsHere(htmlID: string): this;

  /**
   * Handle form submission when validation passes
   * @param id - The HTML element ID of the submit button
   * @param submitAction - Callback function to execute on successful validation
   * @returns The validator instance for chaining
   */
  onSubmitButton(id: string, submitAction: () => void): this;

  /**
   * Configure success/failure feedback behavior
   */
  readonly onSuccess: SuccessHandlers;

  /**
   * Start validating the form
   * @returns True if all fields are currently valid
   */
  validate(): boolean;

  /**
   * Clean up event listeners and reset state
   */
  destroy(): void;

  /**
   * Access to input values via dynamic properties
   * Example: validator.emailValue for input with id="email"
   */
  [key: `${string}Value`]: string;

  /**
   * Set error messages via dynamic properties
   * Example: validator.emailError = "Invalid email"
   */
  [key: `${string}Error`]: string;
}

/**
 * Global FFV instance (browser only)
 */
export const FFV: FastFormValidator;

/**
 * Default export
 */
export default FastFormValidator;
