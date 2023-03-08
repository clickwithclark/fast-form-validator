export function defaultDateOfBirthStrategy(id, minAge = 18) {
  const validArgs = this[`${id}Value`]
    .split('-') // ["1958-09-11"] => ["1958","09","11"]
    .map((string) => Number(string)); // => [1958,09,11]
  const dob = new Date(validArgs).getTime();
  const today = new Date().getTime();

  if (!this[`${id}Value`]) {
    this[`${id}Error`] = '❌Date of birth must be valid';
  }

  // 18yrs x 365days * 24hrs * 60 mins * 60 seconds * 1000 milliseconds
  // 365.25 for leap year considerations
  if (today - minAge * 365.25 * 24 * 60 * 60 * 1000 <= dob) {
    this[`${id}Error`] = `❌Minimum age is ${minAge} years`;
  }
}
