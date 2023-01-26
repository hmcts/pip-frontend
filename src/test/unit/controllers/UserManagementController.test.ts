import { mockRequest } from "../mocks/mockRequest";
import { Response } from "express";
import sinon from "sinon";
import { UserManagementService } from "../../../main/service/userManagementService";
import UserManagementController from "../../../main/controllers/UserManagementController";

const userManagementController = new UserManagementController();

const i18n = {
  "user-management": {},
};

sinon.stub(UserManagementService.prototype, "getFormattedData").returns({
  userData: "test",
  paginationData: "test2",
  emailFieldData: "test3",
  userIdFieldData: "test4",
  userProvenanceIdFieldData: "test5",
  provenancesFieldData: "test6",
  rolesFieldData: "test7",
  categories: "test8",
});

sinon
  .stub(UserManagementService.prototype, "getTableHeaders")
  .returns("testHeader");

describe("User management controller", () => {
  const response = {
    render: () => {
      return "";
    },
  } as unknown as Response;
  const request = mockRequest(i18n);
  request.path = "/user-management";

  it("should render the user management page", async () => {
    request.query = { clear: undefined };
    request.url = "/user-management";

    const responseMock = sinon.mock(response);
    const expectedData = {
      ...i18n["user-management"],
      header: "testHeader",
      userData: "test",
      paginationData: "test2",
      emailFieldData: "test3",
      userIdFieldData: "test4",
      userProvenanceIdFieldData: "test5",
      provenancesFieldData: "test6",
      rolesFieldData: "test7",
      categories: "test8",
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("user-management", expectedData);

    await userManagementController.get(request, response);
    return responseMock.verify();
  });
});
