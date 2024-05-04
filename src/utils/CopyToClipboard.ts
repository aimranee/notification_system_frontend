import { toast } from "react-toastify";
import { transformToVariable } from "./stringFormat";

// export const copyToClipboard = (text: string) => {
//   navigator.clipboard.writeText(text);
//   toast.info('Copied to clipboard');
// };

export const CopyToClipboard = (text: string) => {
  var input = document.createElement("textarea");
  input.innerHTML = transformToVariable(text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand("copy");
  document.body.removeChild(input);
  toast.info("Copied to clipboard");

  return result;
};
