const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function getEmailValidationError(email) {
  if (typeof email !== "string" || !email.trim()) {
    return "Email is required";
  }

  const normalizedEmail = normalizeEmail(email);
  if (normalizedEmail.length > EMAIL_MAX_LENGTH) {
    return `Email must be ${EMAIL_MAX_LENGTH} characters or fewer`;
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return "Enter a valid email address";
  }

  return null;
}

function getPasswordValidationError(password) {
  if (typeof password !== "string" || password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Password must be ${PASSWORD_MAX_LENGTH} characters or fewer`;
  }
  if (!/[a-z]/.test(password)) {
    return "Password must include at least one lowercase character";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase character";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number";
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must include at least one special character";
  }
  return null;
}

module.exports = {
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  getEmailValidationError,
  getPasswordValidationError,
  normalizeEmail,
};
