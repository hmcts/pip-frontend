import request from "supertest";
import { app } from "../../main/app";

describe("Login", () => {
  test("should redirect to the subscription management page", async () => {
    await request(app)
      .get("/login")
      .expect((res) => expect(res.redirect).toBeTruthy);
  });

  test("should redirect to the subscription management page on return", async () => {
    await request(app)
      .post("/login/return")
      .expect((res) => expect(res.redirect).toBeTruthy());
  });

  test("should redirect to the admin dashboard page on return", async () => {
    await request(app)
      .post("/login/admin/return")
      .expect((res) => expect(res.redirect).toBeTruthy());
  });
});
