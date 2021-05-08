import { renderHook, act } from "@testing-library/react-hooks";
import { useModal } from "./useModal";

describe("useModal", () => {
  it("onCreate", () => {
    const { result } = renderHook(() => useModal());

    //
    const { create } = result.current;
    act(() => create());
    expect(result.current.isOpen).toEqual(true);
    expect(result.current.value).toBeUndefined();
  });

  it("onUpdate", () => {
    const VALUE = "hello";

    const { result } = renderHook(() => useModal<string>());

    //
    const { update } = result.current;
    act(() => update(VALUE));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.value).toEqual(VALUE);
  });

  it("Close after update", () => {
    const VALUE = "hello";

    const { result } = renderHook(() => useModal<string>());
    const { update, close } = result.current;

    // update
    act(() => update(VALUE));

    expect(result.current.isOpen).toEqual(true);
    expect(result.current.value).toEqual(VALUE);

    // close
    act(() => close());

    expect(result.current.isOpen).toEqual(false);
    expect(result.current.value).toBeUndefined();
  });
});
