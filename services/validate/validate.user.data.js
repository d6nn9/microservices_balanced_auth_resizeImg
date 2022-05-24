export const validateUser = ({ email, password }) => {
  validateEmail(email);
  validatePassword(password);
};


function validateEmail(email) {
  const reg = /^[-._a-z0-9]+@(?:[a-z0-9][-a-z0-9]+\.)+[a-z]{2,6}/;
  if (reg.test(String(email).toLowerCase())) {
    if (email.length < 40) {
      return email;
    }
  }
  throw new Error('Email is no valid');
}


function validatePassword(password) {
  if (8 < password.length < 20) {
    return password;
  }
  throw new Error('Password is no valid');
}
