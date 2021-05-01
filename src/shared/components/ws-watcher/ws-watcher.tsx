import React from "react";
import useWebSocket from "react-use-websocket";
import { useKeycloak } from "@react-keycloak/web";

export interface ChildrenProps {
  lastMessage: MessageEvent<any> | null;
  lastJsonMessage: any;
}

export interface ProjectStatusWatcherProps {
  url: string;
  children: (args: ChildrenProps) => any;
}

export const WsWatcher: React.FC<ProjectStatusWatcherProps> = ({
  url,
  children,
}) => {
  const { keycloak } = useKeycloak();

  const { lastMessage, lastJsonMessage, sendJsonMessage } = useWebSocket(url, {
    onOpen: () => {
      sendJsonMessage({
        authentication: {
          token: keycloak.token,
        },
      });
    },
    shouldReconnect: (event: CloseEvent) => event.code !== 1011,
    share: true,
  });

  return children({
    lastMessage,
    lastJsonMessage,
  });
};
