/**
 * Test suite for FastFormValidator
 * Run with: npm test
 */

import { FastFormValidator } from '../src/index';

describe('FastFormValidator', () => {
  let validator;
  let container;

  beforeEach(() => {
    // Setup DOM
    container = document.createElement('div');
    container.innerHTML = `
      <form id="test-form">
        <input type="text" id="username" />
        <input type="email" id="email" />
        <input type="password" id="password" />
        <input type="date" id="dob" />
        <button type="submit" id="submit">Submit</button>
        <div id="errors"></div>
      </form>
    `;
    document.body.appendChild(container);

    // Create fresh validator instance
    validator = new FastFormValidator();
  });

  afterEach(() => {
    // Cleanup
    validator.destroy();
    document.body.removeChild(container);
  });

  describe('Initialization', () => {
    test('should create new instance', () => {
      expect(validator).toBeInstanceOf(FastFormValidator);
    });

    test('should allow multiple instances', () => {
      const validator2 = new FastFormValidator();
      expect(validator2).toBeInstanceOf(FastFormValidator);
      expect(validator2).not.toBe(validator);
      validator2.destroy();
    });
  });

  describe('Email Validation', () => {
    test('should validate correct email', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.email).toHaveLength(0);
    });

    test('should reject empty email', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.email).toContain(
        'Email cannot be empty'
      );
    });

    test('should reject invalid email format', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      input.value = 'invalid-email';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.email).toContain(
        'Email must be valid'
      );
    });
  });

  describe('Password Validation', () => {
    test('should validate correct password', () => {
      validator
        .onPassword('password', 8, 20)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('password');
      input.value = 'Password123';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.password).toHaveLength(0);
    });

    test('should reject empty password', () => {
      validator
        .onPassword('password', 8, 20)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('password');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.password.length).toBeGreaterThan(0);
    });

    test('should reject password without uppercase', () => {
      validator
        .onPassword('password', 8, 20)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('password');
      input.value = 'password123';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.password.length).toBeGreaterThan(0);
    });

    test('should reject password without number', () => {
      validator
        .onPassword('password', 8, 20)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('password');
      input.value = 'Password';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.password.length).toBeGreaterThan(0);
    });

    test('should respect min length', () => {
      validator
        .onPassword('password', 8, 20)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('password');
      input.value = 'Pass1';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.password.length).toBeGreaterThan(0);
    });
  });

  describe('Date of Birth Validation', () => {
    test('should validate age over minimum', () => {
      validator
        .onDateOfBirth('dob', 18)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('dob');
      const date = new Date();
      date.setFullYear(date.getFullYear() - 20);
      input.value = date.toISOString().split('T')[0];
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.dob).toHaveLength(0);
    });

    test('should reject age under minimum', () => {
      validator
        .onDateOfBirth('dob', 18)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('dob');
      const date = new Date();
      date.setFullYear(date.getFullYear() - 16);
      input.value = date.toISOString().split('T')[0];
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.dob).toContain(
        'Minimum age is 18 years'
      );
    });

    test('should reject empty date', () => {
      validator
        .onDateOfBirth('dob', 18)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('dob');
      input.value = '';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.dob).toContain(
        'Date of birth must be valid'
      );
    });
  });

  describe('Custom Validation', () => {
    test('should accept custom strategy', () => {
      function customStrategy() {
        if (this.usernameValue.length < 5) {
          this.usernameError = 'Username too short';
        }
      }

      validator
        .setStrategyFor('username', customStrategy)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('username');
      input.value = 'abc';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.username).toContain(
        'Username too short'
      );
    });

    test('should pass arguments to custom strategy', () => {
      function minLengthStrategy(id, minLen) {
        if (this[`${id}Value`].length < minLen) {
          this[`${id}Error`] = `Minimum ${minLen} characters`;
        }
      }

      validator
        .setStrategyFor('username', minLengthStrategy, 'username', 10)
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('username');
      input.value = 'short';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(validator.formState.errors.username).toContain(
        'Minimum 10 characters'
      );
    });
  });

  describe('Error Display', () => {
    test('should display errors in specified element', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const errorElement = document.getElementById('errors');
      expect(errorElement.textContent).toContain('Email must be valid');
    });

    test('should throw if error element not found', () => {
      expect(() => {
        validator.displayErrorsHere('non-existent');
      }).toThrow();
    });

    test('should clear previous errors on revalidation', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      
      // First: invalid
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      const errorElement = document.getElementById('errors');
      const firstErrorCount = errorElement.querySelectorAll('li').length;
      
      // Second: valid
      input.value = 'valid@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      
      const secondErrorCount = errorElement.querySelectorAll('li').length;
      expect(secondErrorCount).toBeLessThan(firstErrorCount);
    });
  });

  describe('Form Submission', () => {
    test('should call submit callback when valid', (done) => {
      const submitCallback = jest.fn(() => done());

      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSubmitButton('submit', submitCallback)
        .validate();

      // Make form valid
      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Submit
      const submitBtn = document.getElementById('submit');
      submitBtn.click();

      expect(submitCallback).toHaveBeenCalled();
    });

    test('should not call submit callback when invalid', () => {
      const submitCallback = jest.fn();

      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSubmitButton('submit', submitCallback)
        .validate();

      // Keep form invalid
      const input = document.getElementById('email');
      input.value = 'invalid';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      // Try to submit
      const submitBtn = document.getElementById('submit');
      submitBtn.click();

      expect(submitCallback).not.toHaveBeenCalled();
    });
  });

  describe('Success Handlers', () => {
    test('should hide feedback on success', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSuccess.hideFeedback()
        .validate();

      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const errorElement = document.getElementById('errors');
      expect(errorElement.style.visibility).toBe('hidden');
    });

    test('should remove feedback on success', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSuccess.removeFeedback()
        .validate();

      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const errorElement = document.getElementById('errors');
      expect(errorElement.style.display).toBe('none');
    });

    test('should add class on success', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSuccess.addClass('success-class')
        .validate();

      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      const errorElement = document.getElementById('errors');
      expect(errorElement.classList.contains('success-class')).toBe(true);
    });

    test('should remove class on success', () => {
      const errorElement = document.getElementById('errors');
      errorElement.classList.add('error-class');

      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .onSuccess.removeClass('error-class')
        .validate();

      const input = document.getElementById('email');
      input.value = 'test@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(errorElement.classList.contains('error-class')).toBe(false);
    });
  });

  describe('Chaining', () => {
    test('should support method chaining', () => {
      const result = validator
        .onEmail('email')
        .onPassword('password')
        .displayErrorsHere('errors')
        .validate();

      expect(typeof result).toBe('boolean');
    });
  });

  describe('Cleanup', () => {
    test('should remove event listeners on destroy', () => {
      validator
        .onEmail('email')
        .displayErrorsHere('errors')
        .validate();

      const input = document.getElementById('email');
      const hasListener = !!input._ffvHandler;
      
      validator.destroy();
      
      expect(hasListener).toBe(true);
      expect(input._ffvHandler).toBeUndefined();
    });
  });

  describe('Edge Cases', () => {
    test('should handle missing DOM elements gracefully', () => {
      expect(() => {
        validator.onEmail('non-existent-id').validate();
      }).toThrow();
    });

    test('should handle multiple validators on same page', () => {
      const validator2 = new FastFormValidator();
      
      validator.onEmail('email');
      validator2.onEmail('email');
      
      validator.validate();
      validator2.validate();
      
      // Both should work independently
      expect(validator.formInputs).toContain('email');
      expect(validator2.formInputs).toContain('email');
      
      validator2.destroy();
    });
  });
});