import { expect } from "chai";
import { app } from "../../main/app";
import request from "supertest";
import sinon from "sinon";
import { AccountManagementRequests } from "../../main/resources/requests/accountManagementRequests";

const PAGE_URL = "/update-user-confirmation";

const stub = sinon.stub(AccountManagementRequests.prototype, "updateUser");
const validBody = { userId: "1234", updatedRole: "SYSTEM_ADMIN" };
const invalidBody = { userId: "1", updatedRole: "WRONG_ROLE" };

describe("Update User Confirmation", () => {
  beforeEach(() => {
    stub.withArgs("1234", "SYSTEM_ADMIN").resolves(true);
    stub.withArgs("1", "WRONG_ROLE").resolves(undefined);
    app.request["user"] = { id: "1", roles: "SYSTEM_ADMIN" };
  });

  describe("on POST", () => {
    test("should render the page if body is valid", async () => {
      await request(app)
        .post(PAGE_URL)
        .send(validBody)
        .expect((res) => {
          expect(res.status).to.equal(200);
        });
    });

    test("should render error page if invalid body data", async () => {
      await request(app)
        .post(PAGE_URL)
        .send(invalidBody)
        .expect((res) => {
          expect(res.status).to.equal(200);
        });
    });
  });

  describe("on GET", () => {
    test("should render not found page", async () => {
      await request(app)
        .get(PAGE_URL)
        .expect((res) => {
          expect(res.status).to.equal(404);
        });
    });
  });
});
