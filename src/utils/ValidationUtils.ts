
export const isValidName = (name: string) => {
  let regexp = new RegExp("^[A-Z_]+$");
  return regexp.test(name);
};

export const isValidClientId = (clientId: string) => {
  let regexp = new RegExp("(?!$)(?:[a-z0-9]*)$");
  return regexp.test(clientId);
};

export const isValidRegex = (pattern: string): boolean => {
  try {
    const newPatter = `/${pattern}/`;
    const m = newPatter.match(/^([/~@;%#'])(.*?)\1([gimsuy]*)$/);
    return m ? !!new RegExp(m[2], m[3]) : false;
  } catch (e) {
    return false;
  }
};

export const validateInputs = (variables: Variable[]) => {
  let isValid = true;
  variables.forEach((variable, index) => {
    if (!isValidRegex(variable.validation)) {
      isValid = false;
    }
  });
  return isValid;
};
