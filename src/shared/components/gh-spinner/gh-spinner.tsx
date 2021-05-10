import React from "react";
import { GhSpinnerIcon } from "./gh-spinner-icon";
import styles from "./gh-spinner.module.scss";

export interface GhSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
}

export const GhSpinner: React.FC<GhSpinnerProps> = ({ size = "md" }) => {
  return (
    <GhSpinnerIcon className={`pf-c-spinner pf-m-${size} ${styles.speed}`} />
  );
};
