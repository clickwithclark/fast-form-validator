/**
 * Default function used to evaluate date input fields that are used
 * to capture date of birth
 *
 * @function defaultDateOfBirthStrategy
 * @param  {String} id ID of input field
 * @param  {Number} [minAge = 18] Minimum age required to submit the form
 * @return {Void} Nothing is returned
 */
export function defaultDateOfBirthStrategy(id, minAge = 18) {
  const validArgs = this[`${id}Value`]
    .split('-') // ["1958-09-11"] => ["1958","09","11"]
    .map((string) => Number(string)); // ["1958","09","11"]=> [1958,09,11]
  const dob = new Date(validArgs).getTime();
  const today = new Date().getTime();

  if (!this[`${id}Value`]) {
    this[`${id}Error`] = '❌Date of birth must be valid';
  }

  // current date in seconds - minimum age in seconds
  // 18yrs x 365.25days * 24hrs * 60 mins * 60 seconds * 1000 milliseconds
  // 365.25 for leap year considerations
  if (today - minAge * 365.25 * 24 * 60 * 60 * 1000 <= dob) {
    this[`${id}Error`] = `❌Minimum age is ${minAge} years`;
  }
}
