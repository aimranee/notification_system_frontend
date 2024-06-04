export const extractVariablesFromEmailBody = (body: string): string[] => {
  const regex = /\[\[\$\{([^{}]+)\}\]\]/g;
  let match;
  const variables: string[] = [];
  while ((match = regex.exec(body)) !== null) {
    variables.push(match[1]); // Extract variable name from the match
  }
  return variables;
};

export const findMissingVariables = (
  emailBodyVariables: string[],
  variables: Variable[]
): string[] => {
  const missingVariables = emailBodyVariables.filter(
    (variable) => !variables.map((v) => v.code).includes(variable)
  );
  return missingVariables;
};

export function checkEmailVariablesExist(
  html: string,
  variables: Variable[]
): boolean {
  let variablesExist = true;
  variables.forEach((variable) => {
    if (!html.includes(`[[\${${variable.code}}]]`)) {
      variablesExist = false;
    }
  });
  return variablesExist;
}

export function assembleData(variables: Variable[]): string {
  const assembledData = variables.map((variable) => ({
    name: variable.code,
    validation: variable.validation,
  }));
  return JSON.stringify(assembledData);
}
