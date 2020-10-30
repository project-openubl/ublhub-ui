import { formatPath, Paths } from "Paths";

describe("Paths", () => {
  it("Test formatPath", () => {
    const result = formatPath(Paths.editCompany, {
      company: "myId",
    });
    expect(result).toEqual("/companies/myId");
  });

  it("Test formatPath", () => {
    const result = formatPath(Paths.editCompany, {
      incorrectVar: "myId",
    });
    expect(result).toEqual("/companies/:company");
  });
});
