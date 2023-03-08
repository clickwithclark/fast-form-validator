export function defaultPasswordStrategy(id, min = 6, max = 15) {
  const passwordErrorMessage = `❌Password must contain:\n\t One uppercase letter\n\t One lowercase letter\n\t One digit\n\t Between ${min} to ${max} characters long`;

  const validPasswordRegex = new RegExp(
    String.raw`((?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{${min},${max}})`,
    'i'
  );

  if (!this[`${id}Value`]) {
    this[`${id}Error`] = '❌Password cannot be empty';
  }
  if (this[`${id}Value`] && !validPasswordRegex.test(this[`${id}Value`])) {
    this[`${id}Error`] = passwordErrorMessage;
  }
  if (this[`${id}Value`].length > max) {
    this[`${id}Error`] = passwordErrorMessage;
  }
}
