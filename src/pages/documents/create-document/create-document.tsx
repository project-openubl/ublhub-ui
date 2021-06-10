import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Measure from "react-measure";
import yaml from "js-yaml";

import {
  ActionGroup,
  Button,
  ButtonVariant,
  PageSection,
  Split,
  SplitItem,
  Stack,
  StackItem,
  ToolbarChip,
} from "@patternfly/react-core";
import { CodeEditor, Language } from "@patternfly/react-code-editor";

import { SimplePageSection } from "shared/components";

import { NamespaceRoute, formatPath, Paths } from "Paths";
import { DocumentType } from "api/models";

import { DEFAULT_INVOICE } from "./templates/invoice/invoice";
import { DEFAULT_CREDIT_NOTE } from "./templates/creditnote/creditnote";

import { ToolbarDocument } from "./components/toolbar-document";

import "./editor.scss";

type DocumentListType = {
  [key in DocumentType]: {
    template: any;
  };
};

const documentTypeData: DocumentListType = {
  INVOICE: {
    template: DEFAULT_INVOICE,
  },
  CREDIT_NOTE: {
    template: DEFAULT_CREDIT_NOTE,
  },
};

interface DocumentTypeChip extends ToolbarChip {
  key: DocumentType;
}

const documentTypes: DocumentTypeChip[] = [
  {
    key: "INVOICE",
    node: "Boleta/factura",
  },
  {
    key: "CREDIT_NOTE",
    node: "Nota de crédito",
  },
];

export const CreateDocument: React.FC = () => {
  // Router
  const { namespaceId } = useParams<NamespaceRoute>();

  // Editor
  const [code, setCode] = useState("");
  const [carlos, setCarlos] = useState("");

  // const onSave = useCallback(() => {
    
  // }, []);

  // const onEditorDidMount = useCallback(
  //   (editor: any, monaco: any) => {
  //     editor.layout();
  //     editor.focus();
  //     monaco.editor.getModels()[0].updateOptions({ tabSize: 2 });
  //     editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, onSave);
  //   },
  //   [onSave]
  // );
  
  const onSave = () => {
    console.log(carlos);
  };

  const onEditorDidMount = (editor: any, monaco: any) => {
    editor.layout();
    editor.focus();
    monaco.editor.getModels()[0].updateOptions({ tabSize: 2 });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, onSave);
  };

  // Document type
  const [documentType, setDocumentType] = useState<DocumentTypeChip>();

  useEffect(() => {
    if (documentType) {
      const templateObj = documentTypeData[documentType.key].template;
      setCode(yaml.dump(templateObj));
    }
  }, [documentType]);

  // Form
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      <SimplePageSection
        title="Crear XML"
        breadcrumbs={[
          {
            title: "Documentos",
            path: formatPath(Paths.documentList, {
              namespaceId,
            }),
          },
          {
            title: "create",
            path: "",
          },
        ]}
      />
      <PageSection>
        <Stack hasGutter>
          <StackItem>
            <Split hasGutter>
              <SplitItem>
                <ToolbarDocument
                  docTypeValue={documentType}
                  docTypeOptions={documentTypes}
                  onDocTypeChange={(value) => {
                    setDocumentType(value as DocumentTypeChip);
                  }}
                />
              </SplitItem>
            </Split>
          </StackItem>
          <StackItem isFilled>
            <Measure bounds>
              {({ measureRef, contentRect }) => (
                <div
                  ref={measureRef}
                  className="ocs-yaml-editor__root"
                  style={{ minHeight: 100, height: "100%" }}
                >
                  <div className="ocs-yaml-editor__wrapper">
                    <CodeEditor
                      code={code}
                      language={Language.yaml}
                      isDarkTheme
                      isMinimapVisible
                      isLineNumbersVisible
                      isCopyEnabled
                      isDownloadEnabled
                      isLanguageLabelVisible
                      onChange={(value) => setCarlos(value || "")}
                      onEditorDidMount={onEditorDidMount}
                      height={
                        contentRect.bounds
                          ? `${contentRect.bounds.height - 53}px`
                          : `100px`
                      }
                      width={
                        contentRect.bounds
                          ? `${contentRect.bounds.width - 17}px`
                          : "100%"
                      }
                    />
                  </div>
                </div>
              )}
            </Measure>
          </StackItem>
          <StackItem>
            <ActionGroup>
              <Button
                type="submit"
                aria-label="submit"
                variant={ButtonVariant.primary}
                isDisabled={isSubmitting}
                onClick={onSave}
              >
                Crear
              </Button>
              <Button
                type="button"
                aria-label="cancel"
                variant={ButtonVariant.link}
                isDisabled={isSubmitting}
              >
                Cancelar
              </Button>
            </ActionGroup>
          </StackItem>
        </Stack>
      </PageSection>
    </>
  );
};
