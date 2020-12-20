interface XSenderEnv {
  SSO_ENABLED: string;
}

export const XSENDER_ENV_VARIABLES: XSenderEnv = (window as any)[
  "xsenderConstants"
];

export const isSSOEnabled = () => {
  if (XSENDER_ENV_VARIABLES && XSENDER_ENV_VARIABLES.SSO_ENABLED === "true") {
    return true;
  }
  return false;
};
