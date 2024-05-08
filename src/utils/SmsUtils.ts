export function checkSmsVariablesExist(
  smsBody: string,
  variables: Variable[]
): boolean {
  let variablesExist = true;
  variables.forEach((variable) => {
    if (!smsBody.includes(`[[\${${variable.code}}]]`)) {
      variablesExist = false;
    }
  });
  return variablesExist;
}
