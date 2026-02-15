![Fast Form Validator Logo](./img/ffv_logo.png)  
![Twitter Follow](https://img.shields.io/twitter/follow/clickwithclark?style=social) ![GitHub file size in bytes](https://img.shields.io/github/size/clickwithclark/fast-form-validator/UMD/ffv.min.js?style=flat-square) ![npm](https://img.shields.io/npm/v/fast-form-validator?style=flat-square)
# 🚀 Fast Form Validator (FFV)

[![npm version](https://img.shields.io/npm/v/fast-form-validator?style=flat-square)](https://www.npmjs.com/package/fast-form-validator)
[![Build Status](https://img.shields.io/github/actions/workflow/status/clickwithclark/fast-form-validator/ci.yml?branch=main&style=flat-square)](https://github.com/clickwithclark/fast-form-validator/actions)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/fast-form-validator?style=flat-square)](https://bundlephobia.com/package/fast-form-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)

A lightweight, chainable JavaScript form validation library with **zero dependencies**. Simple API, powerful validation, works everywhere.

## ✨ Features

- 🔗 **Chainable API** - Fluent, readable syntax
- 🎯 **Zero Dependencies** - Pure JavaScript, no bloat
- 📦 **Tiny Bundle** - Less than 5KB minified + gzipped
- 🎨 **Customizable** - Create your own validation strategies
- 🔧 **Framework Agnostic** - Works with vanilla JS, React, Vue, etc.
- 💪 **TypeScript Support** - Full type definitions included
- ♿ **Accessible** - WCAG compliant error messaging
- 🌐 **Browser Support** - IE11+ and all modern browsers

## 📦 Installation

### NPM

```bash
npm install fast-form-validator
```

### CDN

```html
<script src="https://unpkg.com/fast-form-validator@latest/UMD/ffv.min.js"></script>
```

## 🚀 Quick Start

### HTML

```html
<form id="signup-form">
  <input type="email" id="email" />
  <input type="password" id="password" />
  <input type="date" id="dob" />
  <button type="submit" id="submit-btn">Sign Up</button>
  <div id="error-messages"></div>
</form>
```

### JavaScript (Browser)

```javascript
FFV.onEmail('email')
   .onPassword('password', 8, 20)
   .onDateOfBirth('dob', 18)
   .displayErrorsHere('error-messages')
   .onSuccess.removeFeedback()
   .onSubmitButton('submit-btn', handleSubmit)
   .validate();

function handleSubmit() {
  console.log('Form is valid!');
  // Submit your form data
}
```

### JavaScript (Module)

```javascript
import { FastFormValidator } from 'fast-form-validator';

const validator = new FastFormValidator();

validator
  .onEmail('email')
  .onPassword('password', 8, 20)
  .displayErrorsHere('error-messages')
  .validate();
```

## 📚 API Reference

### Built-in Validators

#### `onEmail(id: string)`
Validates email format.

```javascript
FFV.onEmail('email-field');
```

#### `onPassword(id: string, minLength?: number, maxLength?: number)`
Validates password with complexity requirements (uppercase, lowercase, digit).

```javascript
FFV.onPassword('password-field', 8, 20);
// Defaults: min=6, max=15
```

#### `onDateOfBirth(id: string, minAge?: number)`
Validates age requirement.

```javascript
FFV.onDateOfBirth('dob-field', 18);
// Default: minAge=18
```

### Custom Validation

#### `setStrategyFor(id: string, validationFn: Function, ...args: any[])`
Create custom validation logic.

```javascript
function validateUsername() {
  const value = this.usernameValue;
  
  if (!value) {
    this.usernameError = 'Username is required';
  }
  
  if (value.length < 3) {
    this.usernameError = 'Username must be at least 3 characters';
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    this.usernameError = 'Username can only contain letters, numbers, and underscores';
  }
}

FFV.setStrategyFor('username', validateUsername);
```

**With Parameters:**

```javascript
function validateMinLength(id, minLen) {
  const value = this[`${id}Value`];
  
  if (value.length < minLen) {
    this[`${id}Error`] = `Must be at least ${minLen} characters`;
  }
}

FFV.setStrategyFor('bio', validateMinLength, 'bio', 50);
```

### Display & Feedback

#### `displayErrorsHere(id: string)`
Specify where to show validation errors.

```javascript
FFV.displayErrorsHere('error-container');
```

#### `onSuccess.hideFeedback()`
Hide errors using `visibility: hidden` when valid.

```javascript
FFV.onSuccess.hideFeedback();
```

#### `onSuccess.removeFeedback()`
Hide errors using `display: none` when valid.

```javascript
FFV.onSuccess.removeFeedback();
```

#### `onSuccess.addClass(className: string)`
Add a CSS class when validation succeeds.

```javascript
FFV.onSuccess.addClass('valid-form');
```

#### `onSuccess.removeClass(className: string)`
Remove a CSS class when validation succeeds.

```javascript
FFV.onSuccess.removeClass('has-errors');
```

### Form Submission

#### `onSubmitButton(id: string, callback: Function)`
Handle form submission after successful validation.

```javascript
FFV.onSubmitButton('submit-btn', () => {
  // Only called when form is valid
  submitFormData();
});
```

### Validation Control

#### `validate()`
Start validation and attach event listeners.

```javascript
const isValid = FFV.validate();
console.log(isValid); // true or false
```

## 🎨 Advanced Examples

### Multiple Forms on One Page

```javascript
// Form 1
const loginForm = new FastFormValidator();
loginForm
  .onEmail('login-email')
  .onPassword('login-password')
  .displayErrorsHere('login-errors')
  .validate();

// Form 2
const signupForm = new FastFormValidator();
signupForm
  .onEmail('signup-email')
  .onPassword('signup-password', 10, 30)
  .displayErrorsHere('signup-errors')
  .validate();
```

### Conditional Validation

```javascript
function validateConfirmPassword() {
  const password = this.passwordValue;
  const confirm = this.confirmPasswordValue;
  
  if (password !== confirm) {
    this.confirmPasswordError = 'Passwords do not match';
  }
}

FFV.onPassword('password')
   .setStrategyFor('confirmPassword', validateConfirmPassword)
   .validate();
```

### Async Validation

```javascript
function validateUsername() {
  const username = this.usernameValue;
  
  if (!username) {
    this.usernameError = 'Username required';
    return;
  }
  
  // Note: FFV validates synchronously, so handle async externally
  // or use debouncing in your strategy
  
  // Example with debouncing
  clearTimeout(this.usernameTimeout);
  this.usernameTimeout = setTimeout(async () => {
    const available = await checkUsernameAvailability(username);
    if (!available) {
      this.usernameError = 'Username already taken';
      this.validate(); // Re-trigger validation
    }
  }, 500);
}
```

### React Integration

```jsx
import { useEffect, useRef } from 'react';
import { FastFormValidator } from 'fast-form-validator';

function SignupForm() {
  const validatorRef = useRef(null);
  
  useEffect(() => {
    validatorRef.current = new FastFormValidator();
    
    validatorRef.current
      .onEmail('email')
      .onPassword('password', 8, 20)
      .displayErrorsHere('errors')
      .onSubmitButton('submit', handleSubmit)
      .validate();
    
    return () => {
      validatorRef.current.destroy();
    };
  }, []);
  
  const handleSubmit = () => {
    console.log('Form submitted!');
  };
  
  return (
    <form>
      <input type="email" id="email" />
      <input type="password" id="password" />
      <button type="submit" id="submit">Sign Up</button>
      <div id="errors"></div>
    </form>
  );
}
```

### Custom Error Styling

```javascript
FFV.onEmail('email')
   .displayErrorsHere('errors')
   .onSuccess.removeClass('error-visible')
   .validate();
```

```css
#errors {
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

#errors.error-visible {
  background: #fee;
  border: 1px solid #c33;
  color: #c33;
}

#errors:not(.error-visible) {
  display: none;
}
```

## 🔧 Migration Guide

### From v1.x to v2.x

**Breaking Changes:**

1. **Multiple Instances**: If you need multiple forms, use `new FastFormValidator()` instead of the global `FFV`

```javascript
// Old (v1.x) - only one form per page
FFV.onEmail('email').validate();

// New (v2.x) - multiple forms supported
const form1 = new FastFormValidator();
form1.onEmail('email1').validate();

const form2 = new FastFormValidator();
form2.onEmail('email2').validate();

// Or keep using global FFV for single form
FFV.onEmail('email').validate();
```

2. **Error Handling**: Missing DOM elements now throw errors instead of console warnings

```javascript
// Add error handling if elements might not exist
try {
  FFV.displayErrorsHere('errors').validate();
} catch (error) {
  console.error('Validation setup failed:', error);
}
```
## 🎮 Live Demo

See Fast Form Validator in action: **[CodePen Demo](https://codepen.io/clickwithclark/full/zYzWeyK)**

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Run linter
npm run lint
```

## 📝 License

MIT © [clickwithclark](https://github.com/clickwithclark)

## 🙏 Acknowledgments

- Inspired by the Strategy Pattern and fluent interfaces
- Built with ❤️ for the JavaScript community

## 📞 Support

- 📫 [Open an issue](https://github.com/clickwithclark/fast-form-validator/issues)
- 💬 [Discussions](https://github.com/clickwithclark/fast-form-validator/discussions)
- 🐦 [Follow @clickwithclark](https://twitter.com/clickwithclark)

---

**[⬆ back to top](#-fast-form-validator-ffv)**
