import React, { useEffect, useMemo, useState } from "react";
import format from "xml-formatter";

import {
  CodeEditor,
  Language,
  CodeEditorControl,
} from "@patternfly/react-code-editor";
import {
  OutlinedCircleIcon,
  OutlinedCheckCircleIcon,
} from "@patternfly/react-icons";

import { UBLDocument } from "api/models";
import { getDocumentFile } from "api/rest";

export interface IFileViewerProps {
  namespaceId: string;
  ublDocument: UBLDocument;
}

export const FileViewer: React.FC<IFileViewerProps> = ({
  namespaceId,
  ublDocument,
}) => {
  const [showOriginalFile, setShowOriginalFile] = useState(true);
  const [fileContent, setFileContent] = useState("Loading...");

  useEffect(() => {
    getDocumentFile(namespaceId, ublDocument.id!).then((response) => {
      setFileContent(response.data);
    });
  }, [namespaceId, ublDocument]);

  const prettierFileContent = useMemo(() => {
    let result = "";
    if (fileContent !== "Loading...") {
      try {
        result = format(fileContent, {
          indentation: "  ",
          collapseContent: true,
          lineSeparator: "\n",
        });
      } catch (error) {
        console.log(error);
        result = "Can not prettify file. XML corrupted or invalid."
      }      
    }
    return result;
  }, [fileContent]);

  return (
    <CodeEditor
      isDarkTheme
      isLineNumbersVisible
      isReadOnly
      isMinimapVisible
      isLanguageLabelVisible
      code={showOriginalFile ? fileContent : prettierFileContent}
      language={Language.xml}
      height="600px"
      isCopyEnabled
      isDownloadEnabled
      downloadFileName={ublDocument.fileContent?.documentID || "file.xml"}
      customControls={[
        <CodeEditorControl
          icon={
            showOriginalFile ? (
              <OutlinedCircleIcon />
            ) : (
              <OutlinedCheckCircleIcon />
            )
          }
          aria-label="Execute code"
          toolTipText={showOriginalFile ? "Prettify" : "Original"}
          onClick={() => {
            setShowOriginalFile((value) => !value);
          }}
        />,
      ]}
    />
  );
};
