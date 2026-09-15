const VALID_STATUSES = ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidEmail(value) {
  return isNonEmptyString(value) && EMAIL_REGEX.test(value.trim());
}

function isValidStatus(value) {
  return VALID_STATUSES.includes(value);
}

module.exports = {
  VALID_STATUSES,
  isNonEmptyString,
  isValidEmail,
  isValidStatus,
};
