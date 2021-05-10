import { formatPath, Paths } from "Paths";

describe("Paths", () => {
  it("Test correct formatPath", () => {
    const result = formatPath(Paths.editCompany, {
      companyId: "myId",
    });
    expect(result).toEqual("/ns-company/:namespaceId/companies/myId");
  });

  it("Test incorrect formatPath", () => {
    const result = formatPath(Paths.editCompany, {
      incorrectVar: "myId",
    });
    expect(result).toEqual("/ns-company/:namespaceId/companies/:companyId");
  });
});
