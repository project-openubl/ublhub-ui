import React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { mount, shallow } from "enzyme";
import { AxiosError } from "axios";

import { Button, Skeleton } from "@patternfly/react-core";
import { Table } from "@patternfly/react-table";

import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import { rootReducer } from "store/rootReducer";

describe("ProjectList", () => {
  // const historyPushMock = jest.fn();
  // const routeProps: RouteComponentProps = {
  //   history: { push: historyPushMock } as any,
  //   location: {} as any,
  //   match: {} as any,
  // };

  // const mockStore = (initialStatus: any) =>
  //   createStore(
  //     rootReducer,
  //     initialStatus,
  //     composeWithDevTools(applyMiddleware(thunk))
  //   );

  // const getWrapper = (state: ProjectListState = defaultState, props?: any) => (
  //   <Provider store={mockStore({ [stateKey]: state })}>
  //     <ProjectList {...routeProps} {...props} />
  //   </Provider>
  // );

  it("Renders welcome", () => {
    // const defaultState: ProjectListState = {
    //   projects: [],
    //   status: "complete",
    //   error: undefined,
    // };
    // const wrapper = mount(getWrapper(defaultState));
    // expect(wrapper.find(Welcome).length).toEqual(1);
  });
});
