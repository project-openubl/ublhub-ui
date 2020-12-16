import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFetchCompany } from "./useFetchCompany";
import { Company, PageRepresentation } from "api/models";

describe("useFetchCompany", () => {
  it("Fetch error due to no REST API found", async () => {
    const COMPANY_NAME = "mycompany";

    // Mock REST API
    new MockAdapter(axios).onGet("/companies/" + COMPANY_NAME).networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchCompany());

    const { company, isFetching, fetchError, fetchCompany } = result.current;

    expect(isFetching).toBe(false);
    expect(company).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchCompany(COMPANY_NAME));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.company).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: Company = {
      name: "myCompany",
      webServices: {
        factura: "http://url1.com",
        guia: "http://url2.com",
        retenciones: "http://url3.com",
      },
      credentials: {
        username: "myUsername",
        password: "myPassword",
      },
    };

    new MockAdapter(axios).onGet(`/companies/${data.name}`).reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchCompany());

    const { company, isFetching, fetchError, fetchCompany } = result.current;

    expect(isFetching).toBe(false);
    expect(company).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchCompany(data.name));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.company).toMatchObject(data);
    expect(result.current.fetchError).toBeUndefined();
  });
});
