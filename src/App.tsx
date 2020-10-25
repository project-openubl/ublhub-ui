import React from "react";

import "./App.scss";

import { DefaultLayout } from "./layout";

const App: React.FC = () => {
  return (
    <DefaultLayout>
      <p>hello world</p>
    </DefaultLayout>
  );
};

export default App;
