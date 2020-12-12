import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useDeleteCompany } from "./useDeleteCompany";
import { Company } from "api/models";

describe("useDeleteCompany", () => {
  it("Valid initial status", () => {
    // Use hook
    const { result } = renderHook(() => useDeleteCompany());

    const { isDeleting, deleteCompany } = result.current;

    expect(isDeleting).toBe(false);
    expect(deleteCompany).toBeDefined();
  });

  it("Delete error", async () => {
    const company: Company = {
      name: "mycompany",
      webServices: {
        factura: "",
        guia: "",
        retenciones: "",
      },
      credentials: {
        username: "",
        password: "",
      },
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios)
      .onDelete(`/companies/${company.name}`)
      .networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteCompany());
    const { deleteCompany } = result.current;

    // Init delete
    act(() => deleteCompany(company, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(0);
    expect(onErrorMock).toHaveBeenCalledTimes(1);
  });

  it("Delete success", async () => {
    const company: Company = {
      name: "mycompany",
      webServices: {
        factura: "",
        guia: "",
        retenciones: "",
      },
      credentials: {
        username: "",
        password: "",
      },
    };
    const onSuccessMock = jest.fn();
    const onErrorMock = jest.fn();

    // Mock REST API
    new MockAdapter(axios).onDelete(`/companies/${company.name}`).reply(201);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useDeleteCompany());
    const { deleteCompany } = result.current;

    // Init delete
    act(() => deleteCompany(company, onSuccessMock, onErrorMock));
    expect(result.current.isDeleting).toBe(true);

    // Delete finished
    await waitForNextUpdate();
    expect(result.current.isDeleting).toBe(false);
    expect(onSuccessMock).toHaveBeenCalledTimes(1);
    expect(onErrorMock).toHaveBeenCalledTimes(0);
  });
});
