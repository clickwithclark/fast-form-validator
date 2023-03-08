export function defaultEmailStrategy() {
  // eslint-disable-next-line no-useless-escape
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!this.emailValue) {
    this.emailError = '❌Email cannot be empty';
  }
  if (this.emailValue && !validEmailRegex.test(this.emailValue)) {
    this.emailError = '❌Email must be valid';
  }
}
export function defaultDateOfBirthStrategy(minAge = 18) {
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
export function defaultPasswordStrategy(min = 6, max = 15) {
  const passwordErrorMessage = `❌Password must contain:\n\t One uppercase letter\n\t One lowercase letter\n\t One digit\n\t Between ${min} to ${max} characters long`;

  const validPasswordRegex = new RegExp(
    String.raw`((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})`,
    'i'
  );

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
