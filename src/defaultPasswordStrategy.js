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
