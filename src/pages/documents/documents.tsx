import React, { lazy, Suspense } from "react";
import { Switch, Route } from "react-router-dom";

import {
  AppPlaceholder,
  NamespaceContextSelectorSection,
} from "shared/components";
import { Paths } from "Paths";

import { NamespaceContextSelector } from "shared/containers";

const DocumentList = lazy(() => import("./document-list"));
const NewDocument = lazy(() => import("./upload-document"));
const CreateDocument = lazy(() => import("./create-document"));

export const Documents: React.FC = () => {
  return (
    <>
      <NamespaceContextSelectorSection>
        <NamespaceContextSelector url={Paths.documentList} />
      </NamespaceContextSelectorSection>
      <Suspense fallback={<AppPlaceholder />}>
        <Switch>
          <Route path={Paths.documentList} component={DocumentList} exact />
          <Route path={Paths.uploadDocument} component={NewDocument} />
          <Route path={Paths.createDocument} component={CreateDocument} />
        </Switch>
      </Suspense>
    </>
  );
};
