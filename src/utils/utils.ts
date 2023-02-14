// code for both frontend and backend

export const booleanify = (value: string | number | undefined): boolean => {
  if (value === "false" || value === "undefined" || value === "0" || value === "-0") {
    return false;
  }
  return !!value;
};