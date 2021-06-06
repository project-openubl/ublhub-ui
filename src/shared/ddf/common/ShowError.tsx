type validatedType = "success" | "error" | "default";
const showError = ({
  error,
  touched,
}: {
  error?: any;
  touched?: any;
}): { validated: validatedType } => ({
  validated: touched && error ? "error" : "default",
});

export default showError;
