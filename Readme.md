![Fast Form Validator Logo](./img/ffv_logo.png)  
![Twitter Follow](https://img.shields.io/twitter/follow/clickwithclark?style=social) ![GitHub file size in bytes](https://img.shields.io/github/size/clickwithclark/fast-form-validator/UMD/ffv.min.js?style=flat-square) ![npm](https://img.shields.io/npm/v/fast-form-validator?style=flat-square)

### Table of Contents

- [fast-form-validator][1]
  - [Properties][2]
  - [Examples][3]
  - [onEmail][4]
    - [Parameters][5]
  - [onPassword][6]
    - [Parameters][7]
  - [onDateOfBirth][8]
    - [Parameters][9]
  - [setStrategyFor][10]
    - [Parameters][11]
  - [onSubmitButton][12]
    - [Parameters][13]
  - [displayErrorsHere][14]
    - [Parameters][15]
  - [onSuccess.hideFeedback][16]
  - [onSuccess.removeFeedback][17]
  - [onSuccess.addClass][25]
  - [onSuccess.removeClass][26]
  - [validate][18]

## fast-form-validator

used as FFV is a streamlined solution to validate input fields.

Type: [Object][19]

### Properties

- [🔗][4] `onEmail` **[Function][20]** The default email field validator.
- [🔗][6] `onPassword` **[Function][20]** The default password field validator.
- [🔗][8] `onDateOfBirth` **[Function][20]** The default date field validator.
- [🔗][10] `setStrategyFor` **[Function][20]** Creates a custom validator for a given input field.
- [🔗][12] `onSubmitButton` **[Function][20]** Executes a function when a **VALID** form is submitted.
- [🔗][14]`displayErrorsHere` **[Function][20]** The HTML container (usually a div)
  that will show the list of feedback Messages.
- `onSuccess` **[Object][19]** Contains two(4) ways to hide or handle the feedback element.

  - [🔗][17]`onSuccess.removeFeedback` **[Function][20]** Hides the feedback element based on the display CSS property.
  - [🔗][16]`onSuccess.hideFeedback` **[Function][20]** Hides the feedback element based on the visibility CSS property.
  - [🔗][25]`onSuccess.addClass` **[Function][20]** Add a class to feedback element classList.
  - [🔗][26]`onSuccess.removeClass` **[Function][20]** Remove a class from feedback element classList.

- [🔗][18]`validate` **[Function][20]** Starts the validating
  process by listening for changes on input fields.

### Examples

```javascript
<!DOCTYPE html>
<html lang="en">
<head>
<title>Your Form</title>
<script defer type="module" src="https://unpkg.com/fast-form-validator@latest/UMD/ffv.min.js"></script>
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

npm i fast-form-validator

const { FFV } = require('fast-form-validator');
```

### onEmail

Validates email input fields based on the input field ID

#### Parameters

- `id` **[String][21]** email input ID

Returns **[fast-form-validator][22]**

### onPassword

Validates password input fields with a minimum and maximum character limit
based on the input field ID.
It enforces at least One upper case ,one lowercase and one digit.
Default character limits are between 6 and 15 characters

#### Parameters

- `id` **[String][21]** Password input ID
- `minLength` **[Number][23]** Min password character length
- `maxLength` **[Number][23]** Max password character length

Returns **[fast-form-validator][22]**

### onDateOfBirth

Validates date input fields with a minimum age limit based on the input
field ID

#### Parameters

- `id` **[String][21]** Date of birth input ID
- `age` **[Number][23]** Minimum age allowed checked against today's date

Returns **[fast-form-validator][22]**

### setStrategyFor

Provide fast-form-validator with the ID of an input field and the respective
function to validate that input field

When an ID is passed, the ID is used as a prefix to create a getter
for the current input value and a setter to set the error messages using the ID
as a prefix with camelCase (e.g. someIDValue & someIDError) to get the value for
assessment and to set the error messages to display to the user on invalid input

These will be properties and not methods, therefore accessed using:

```this.usernameValue``` and ```this.usernameError```

Or if you hate the this keyword

```FFV.usernameValue``` and ```FFV.usernameError```

Immediately giving you access to form field values
in the document and a place to store a list of errors

Example:

```html
<input type="text" class="form-control" id="username" />
```


Here a custom strategy is set to evaluate a username input field
```js
FFV.setStrategyFor("username", atLeastSix);
```

When 'setStrategyFor' is called, it dynamically creates 2 properties on 
the FFV instance with the ID as a prefix to the word Value and Error giving you quick and easy access to the values of the input fields so 
you can start immediately validating the values.
```js 
this.usernameValue; 
```
```js
this.usernameError = "username must be...";
```
```this.usernameError``` sets this message in an array that will be shown if the input field value is invalid


Error messages are stored in an array and can be displayed all at once or once per invalid condition.

Here is a once per invalid entry example:

```js
function atLeastSix() {
  if (!this.usernameValue) {
    this.usernameError = "❌ username can not be empty";
  }
  if (this.usernameValue && this.usernameValue.length < 6) {
    this.usernameError = "❌Username must be at least 6 characters long";
  }
}
```

To display all error messages at once, append the array instead of replacing the single error message

Usage: passing only the function reference
FFV.setStrategyFor("username", atLeastSix);

#### Parameters

- `id` **[String][21]** Input field ID
- `strategyFunction` **[Function][20]** Function to validate that input field

Returns **[fast-form-validator][22]**

### onSubmitButton

Pass a function to be executed when there are no input errors and the user clicks submit. A **successful** submission will immediately stop the submit button from receiving input, execute the desired function, then remove all event listeners for all aformentioned input fields and even the submit button. You can read more on why you would want to remove event listeners [here](https://eloquentjavascript.net/15_event.html) though not as consequential in modern browsers.

#### Parameters

- `id` **[String][21]** Submit button ID
- `submitAction` **[Function][20]** Function to run when the user submits the form and the form has passed validation (no input errors)

Returns **[fast-form-validator][22]**

### displayErrorsHere

#### Parameters

- `htmlID` **[String][21]** ID of the HTML container element that will display the error messages

Returns **[fast-form-validator][22]**

### onSuccess.hideFeedback

Hides the element that contains the feedback messages using
css visibility property

Returns **[fast-form-validator][22]**

### onSuccess.removeFeedback

Hides the element that contains the feedback messages using
css display property

Returns **[fast-form-validator][22]**

### onSuccess.addClass

Adds a classname to the element that contains the feedback
messages on successful validation

Returns **[fast-form-validator][22]**

### onSuccess.removeClass

Removes a classname to the element that contains the feedback
messages on successful validation

Returns **[fast-form-validator][22]**

### validate

The last method that should be called after setting strategies
for inputs or after using default strategies, it starts the validating
process by listening to input fields.

Returns **[Boolean][24]** true if the all fields have valid input, false otherwise

## Live Example

[Here](https://codepen.io/clickwithclark/full/zYzWeyK)

## Purpose

I just started learning react observing how it manages state and I got the idea
to make this module, learning the revealing module pattern as well as strategy pattern along the way

[1]: #fast-form-validator
[2]: #properties
[3]: #examples
[4]: #onemail
[5]: #parameters
[6]: #onpassword
[7]: #parameters-1
[8]: #ondateofbirth
[9]: #parameters-2
[10]: #setstrategyfor
[11]: #parameters-3
[12]: #onsubmitbutton
[13]: #parameters-4
[14]: #displayerrorshere
[15]: #parameters-5
[16]: #onsuccesshidefeedback
[17]: #onsuccessremovefeedback
[18]: #validate
[19]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object
[20]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function
[21]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String
[22]: #fast-form-validator
[23]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number
[24]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[25]: #onsuccessaddclass
[26]: #onsuccessremoveclass
