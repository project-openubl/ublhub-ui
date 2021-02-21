import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { renderHook, act } from "@testing-library/react-hooks";
import { useFetchCompanies } from "./useFetchCompanies";
import { Company, PageRepresentation } from "api/models";

describe("useFetchCompanies", () => {
  it("Fetch error due to no REST API found", async () => {
    // Mock REST API
    new MockAdapter(axios).onGet("/user/companies").networkError();

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchCompanies());

    const {
      companies,
      isFetching,
      fetchError,
      fetchCompanies,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(companies).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchCompanies({}, { page: 2, perPage: 50 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.companies).toBeUndefined();
    expect(result.current.fetchError).not.toBeUndefined();
  });

  it("Fetch success", async () => {
    // Mock REST API
    const data: PageRepresentation<Company> = {
      meta: {
        offset: 0,
        limit: 0,
        count: 0,
      },
      links: {
        first: "",
        previous: "",
        last: "",
        next: "",
      },
      data: [],
    };

    new MockAdapter(axios)
      .onGet(`/user/companies?offset=0&limit=10`)
      .reply(200, data);

    // Use hook
    const { result, waitForNextUpdate } = renderHook(() => useFetchCompanies());

    const {
      companies,
      isFetching,
      fetchError,
      fetchCompanies,
    } = result.current;

    expect(isFetching).toBe(false);
    expect(companies).toBeUndefined();
    expect(fetchError).toBeUndefined();

    // Init fetch
    act(() => fetchCompanies({}, { page: 1, perPage: 10 }));
    expect(result.current.isFetching).toBe(true);

    // Fetch finished
    await waitForNextUpdate();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.companies).toMatchObject(data);
    expect(result.current.fetchError).toBeUndefined();
  });
});
