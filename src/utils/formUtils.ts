export const validatedState = (touchedFieldVal: any, errorsFieldVal: any) =>
  !(touchedFieldVal && errorsFieldVal) ? "default" : "error";
