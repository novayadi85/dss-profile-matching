

export const errors = {
  EMAIL_FORMAT: "EMAIL_FORMAT",
  FIELD_EMPTY: "FIELD_EMPTY",
  PASSWORD_LENGTH: "PASSWORD_LENGTH",
};

export const validateEmailFormat = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export const validateFieldRequired = (value) => {
  if (value.length === 0) {
    return errors.FIELD_EMPTY;
  }
  return "";
}

export const validatePassword = (value) => {
  if (value.length === 0) {
    return errors.FIELD_EMPTY;
  } else if (value.length < 8) {
    return errors.PASSWORD_LENGTH;
  }
  return "";
}

export const formErrorMessage = (errorConstant) => {
  switch (errorConstant) {
    case errors.EMAIL_FORMAT:
      return "Email not in correct format";
    case errors.FIELD_EMPTY:
      return "This field is required";
    case errors.PASSWORD_LENGTH:
      return "That's not long enough (min 8 characters)";
    default:
      return "";
  }
};
