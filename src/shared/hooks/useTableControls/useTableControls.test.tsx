import { SortByDirection } from "@patternfly/react-table";
import { renderHook, act } from "@testing-library/react-hooks";
import { useTableControls } from "./useTableControls";

describe("useTableControls", () => {
  it("Update state correctly on handling methods", () => {
    const { result } = renderHook(() => useTableControls());

    const { handleFilterTextChange } = result.current;
    act(() => handleFilterTextChange("My filtertext"));
    expect(result.current.filterText).toBe("My filtertext");

    const { handlePaginationChange } = result.current;
    act(() => handlePaginationChange({ page: 2, perPage: 50 }));
    expect(result.current.pagination).toMatchObject({
      page: 2,
      perPage: 50,
    });

    const { handleSortChange } = result.current;
    act(() =>
      handleSortChange(
        jest.fn() as any,
        2,
        SortByDirection.desc,
        jest.fn() as any
      )
    );
    expect(result.current.sortBy).toMatchObject({
      index: 2,
      direction: SortByDirection.desc,
    });
  });
});
