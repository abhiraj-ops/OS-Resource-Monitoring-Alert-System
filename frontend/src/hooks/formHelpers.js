export function getFieldError(errors, field) {
  return errors[field] || "";
}

export function hasError(errors, field) {
  return Boolean(errors[field]);
}
