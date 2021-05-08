import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";

import { useDelete } from "./useDelete";

describe("useDelete", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() =>
      useDelete<string>({
        onDelete: jest.fn(),
      })
    );

    const { isDeleting, requestDelete } = result.current;

    expect(isDeleting).toBe(false);
    expect(requestDelete).toBeDefined();
  });

  it("Delete error", async () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete("/countries/peru").networkError();

    // Use hook
    const onDelete = (value: string) => {
      return axios.delete(`/countries/${value}`);
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useDelete<string>({ onDelete })
    );
    const { requestDelete } = result.current;

    // Init delete
    act(() => requestDelete("peru", onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete("/countries/peru").reply(201);

    // Use hook
    const onDelete = (value: string) => {
      return axios.delete(`/countries/${value}`);
    };

    const { result, waitForNextUpdate } = renderHook(() =>
      useDelete<string>({ onDelete })
    );
    const { requestDelete: fireDelete } = result.current;

    // Init delete
    act(() => fireDelete("peru", onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
