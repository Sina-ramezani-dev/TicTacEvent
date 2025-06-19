function isPasswordStrong(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*]).{12,}$/;
  return regex.test(password);
}

module.exports = { isPasswordStrong };
