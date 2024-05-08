import { useToast } from "@/components/ui/use-toast";

export const isValidName = (name: string) => {
  let regexp = new RegExp("^[A-Z_]+$");
  return regexp.test(name);
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
  const { toast } = useToast();
  let isValid = true;
  variables.forEach((variable, index) => {
    if (!isValidRegex(variable.validation)) {
      isValid = false;
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: `Invalid regex pattern for variable ${variable.code}`,
      });
    }
  });
  return isValid;
};
