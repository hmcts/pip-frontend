import sinon from "sinon";
import request from "supertest";
import { app } from "../../../main/app";
import { expect } from "chai";
import { AccountManagementRequests } from "../../../main/resources/requests/accountManagementRequests";
import { request as expressRequest } from "express";

const PAGE_URL = "/update-user?id=1234";
const headingClass = "govuk-heading-l";
const insetTextClass = "govuk-inset-text";
const roleSelectBoxClass = "govuk-select";
const buttonClass = "govuk-button";
let htmlRes: Document;

sinon.stub(AccountManagementRequests.prototype, "getUserByUserId").resolves({
  userId: "1234",
  userProvenance: "PI_AAD",
  provenanceUserId: "4dcea424-03ed-43d6-88b8-a99ce8159da2",
  email: "test@email.com",
  roles: "INTERNAL_SUPER_ADMIN_CTSC",
  createdDate: "2022-11-05T18:45:37.720216",
  lastSignedInDate: "2022-11-07T18:45:37.720216",
});

describe("Update User Page", () => {
  beforeAll(async () => {
    expressRequest["user"] = { roles: "SYSTEM_ADMIN" };

    await request(app)
      .get(PAGE_URL)
      .then((res) => {
        htmlRes = new DOMParser().parseFromString(res.text, "text/html");
      });
  });

  it("should display heading", () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains(
      "What role would you like test@email.com to have?",
      "Could not find the header"
    );
  });

  it("should display inset text", () => {
    const insetText = htmlRes.getElementsByClassName(insetTextClass);
    expect(insetText[0].innerHTML).contains(
      "This users current role is CTSC Super Admin",
      "Could not find the inset text"
    );
  });

  it("should display the update role select box", () => {
    const selectBox = htmlRes.getElementsByClassName(roleSelectBoxClass);
    expect(selectBox[0].innerHTML).contains(
      "CTSC Super Admin",
      "Could not find select box text"
    );
  });

  it("should display the continue button", () => {
    const button = htmlRes.getElementsByClassName(buttonClass);
    expect(button[4].innerHTML).contains(
      "Continue",
      "Could not find the continue button"
    );
  });
});
