

![Fast Form Validator Logo](https://i.ibb.co/Pwqr8wG/ffv-logo.png)  
![Twitter Follow](https://img.shields.io/twitter/follow/clickwithclark?style=social) ![GitHub file size in bytes](https://img.shields.io/github/size/clickwithclark/fast-form-validator/UMD/ffv.min.js?style=flat-square) ![npm](https://img.shields.io/npm/v/fast-form-validator?style=flat-square)
### Table of Contents

*   [FastFormValidator][1]
    *   [Properties][2]
    *   [Examples][3]
    *   [onEmail][4]
        *   [Parameters][5]
    *   [onPassword][6]
        *   [Parameters][7]
    *   [onDateOfBirth][8]
        *   [Parameters][9]
    *   [setStrategyFor][10]
        *   [Parameters][11]
    *   [onSubmitButton][12]
        *   [Parameters][13]
    *   [displayErrorsHere][14]
        *   [Parameters][15]
    *   [onSuccess.hideFeedback][16]
    *   [onSuccess.removeFeedback][17]
    *   [validate][18]

## FastFormValidator

used as FFV is a streamlined solution to validate input fields.

Type: [Object][19]

### Properties

*   `onEmail` **[Function][20]** The default [email][4] field validator.
*   `onPassword` **[Function][20]** The default [password][6] field validator.
*   `onDateOfBirth` **[Function][20]** The default [date][8] field validator.
*   `setStrategyFor` **[Function][20]** Creates a custom validator for a given input field.
*   `onSubmitButton` **[Function][20]** Executes a function when a **VALID** form is submitted.
*   `displayErrorsHere` **[Function][20]** The HTML container (usually a div)
    that will show the list of feedback Messages.
*   `onSuccess` **[Object][19]** Contains two(2) ways to hide the feedback element

    *   `onSuccess.removeFeedback` **[Function][20]** Hides the feedback element based on the display css property
    *   `onSuccess.hideFeedback` **[Function][20]** Hides the feedback element based on the visibility css property
*   `validate` **[Function][20]** Starts the validating
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

*   `id` **[String][21]** email input ID

Returns **[FastFormValidator][22]** 

### onPassword

Validates password input fields with a minimum and maximum character limit
based on the input field ID.
It enforces at least One upper case ,one lowercase and one digit. 
Default character limits are between 6 and 15 characters

#### Parameters

*   `id` **[String][21]** Password input ID
*   `minLength` **[Number][23]** Min password character length
*   `maxLength` **[Number][23]** Max password character length

Returns **[FastFormValidator][22]** 

### onDateOfBirth

Validates date input fields with a minimum age limit based on the input
field ID

#### Parameters

*   `id` **[String][21]** Date of birth input ID
*   `age` **[Number][23]** Minimum age allowed checked against today's date

Returns **[FastFormValidator][22]** 

### setStrategyFor

Provide FastFormValidator with the ID of an input field and the respective
function to validate that input field

When an ID is passed, the ID is used as a prefix to create a getter
for the current input value and a setter to set the error messages using the ID 
as a prefix with camelCase (e.g. someIDValue & someIDError) to get the value for
assessment and to set the error messages to display to the user on invalid input



Example:

```html
<input type="text" class="form-control" id="username">
```

```js
 FFV.setStrategyFor('username', atLeastSix);
//returns the value of the input field to be tested
 FFV.usernameValue 
//sets this message in an array that will be shown if the input field 
 FFV.usernameError = "username must be..." 
```

Error messages are stored in an array and can be displayed all at once or
once per invalid condition, here is a once per invalid entry example:

```js
function atLeastSix() {
    if (!this.usernameValue) {
        this.usernameError = '❌ username can not be empty';
    }
    if (this.usernameValue && this.usernameValue.length < 6) {
        this.usernameError = '❌Username must be at least 6 characters long';
    }
}
//Usage: passing only the function reference
FFV.setStrategyFor('username', atLeastSix);

```

#### Parameters

*   `id` **[String][21]** Input field ID
*   `strategyFunction` **[Function][20]** Function to validate that input field

Returns **[FastFormValidator][22]** 

### onSubmitButton
Pass a function to be executed when there are no input errors and the user clicks submit. A **successful** submission will immediately stop the submit button from receiving input, execute the desired function, then remove all event listeners for all aformention input fields and even the submit button. You can read more on why you would want to remove event listeners [here](https://eloquentjavascript.net/15_event.html) though not as consequential in modern browsers.

#### Parameters

*   `id` **[String][21]** Submit button ID
*   `submitAction` **[Function][20]** Function to run when the user submits the form and the form has passed validation (no input errors)

Returns **[FastFormValidator][22]** 

### displayErrorsHere

#### Parameters

*   `htmlID` **[String][21]** ID of the HTML container element that will display the error messages

Returns **[FastFormValidator][22]** 

### onSuccess.hideFeedback

Hides the element that contains the feedback messages using
css visibility property

Returns **[FastFormValidator][22]** 

### onSuccess.removeFeedback

Hides the element that contains the feedback messages using
css display property

Returns **[FastFormValidator][22]** 

### validate

The last method that should be called  after setting strategies
for inputs or after using default strategies, it starts the validating
process by listening to input fields.

Returns **[Boolean][24]** true if the all fields have valid input, false otherwise

## Live Example

[Here](https://codepen.io/clickwithclark/full/zYzWeyK)

## Purpose
I just started learning react observing how it manages state and I got the idea
to make this module, learning the revealing module pattern as well as strategy pattern along the way

[1]: #fastformvalidator

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

[22]: #fastformvalidator

[23]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number

[24]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Boolean
