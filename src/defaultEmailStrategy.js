/**
 * Default function used to evaluate email input fields
 * @function defaultEmailStrategy
 * @param  {String} id ID of input field
 * @return {Void} Nothing is returned
 */
export function defaultEmailStrategy(id) {
  // eslint-disable-next-line no-useless-escape
  const validEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  if (!this[`${id}Value`]) {
    this[`${id}Error`] = '❌Email cannot be empty';
  }
  if (this[`${id}Value`] && !validEmailRegex.test(this[`${id}Value`])) {
    this[`${id}Error`] = '❌Email must be valid';
  }
}
