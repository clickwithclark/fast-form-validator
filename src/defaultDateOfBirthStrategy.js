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
