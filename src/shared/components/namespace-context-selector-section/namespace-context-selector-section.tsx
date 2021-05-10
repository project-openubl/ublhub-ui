import React from "react";
import {
  PageSection,
  PageSectionVariants,
  Divider,
} from "@patternfly/react-core";

import styles from "./namespace-context-selector-section.module.scss";

export const NamespaceContextSelectorSection: React.FC = ({ children }) => {
  return (
    <PageSection
      variant={PageSectionVariants.light}
      className={styles.pageSection}
    >
      <div className={styles.content}>{children}</div>
      <Divider className={styles.contentBottomDivider} />
    </PageSection>
  );
};
