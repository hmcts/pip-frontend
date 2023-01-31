import sinon from "sinon";
import { PendingSubscriptionsFromCache } from "../../../../main/resources/requests/utils/pendingSubscriptionsFromCache";
const { redisClient } = require("../../../../main/cacheManager");

const mockUser = {
  id: "1",
};
const pendingSubscriptionsFromCache = new PendingSubscriptionsFromCache();
const mockCourt = [
  {
    locationId: 643,
    name: "Aberdeen Tribunal Hearing Centre",
    jurisdiction: "Tribunal",
    location: "Scotland",
    hearingList: [],
    hearings: 0,
  },
];
const mockCase = [
  {
    hearingId: 5,
    locationId: 50,
    courtNumber: 1,
    date: "15/11/2021 10:00:00",
    judge: "His Honour Judge A Morley QC",
    platform: "In person",
    caseNumber: "T485914",
    caseName: "Ashely Barnes",
    urn: "IBRANE1BVW",
  },
];
const getStub = sinon.stub(redisClient, "get");
getStub
  .withArgs("pending-courts-subscriptions-1")
  .resolves(JSON.stringify(mockCourt));
getStub
  .withArgs("pending-cases-subscriptions-1")
  .resolves(JSON.stringify(mockCase));
getStub.withArgs("pending-courts-subscriptions-2").resolves([]);
sinon.stub(redisClient, "status").value("ready");

describe("setPendingSubscriptions with valid user", () => {
  const set = sinon.stub(redisClient, "set");

  it("should set case into cache", async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions(
      mockCase,
      "cases",
      mockUser.id
    );
    sinon.assert.called(set);
  });

  it("should set court into cache", async () => {
    await pendingSubscriptionsFromCache.setPendingSubscriptions(
      mockCourt,
      "courts",
      mockUser.id
    );
    sinon.assert.called(set);
  });

  it("should get cases list from the cache", async () => {
    const cachedResult =
      await pendingSubscriptionsFromCache.getPendingSubscriptions(
        mockUser.id,
        "cases"
      );
    expect(cachedResult).toStrictEqual(mockCase);
  });

  it("should get courts list from the cache", async () => {
    const cachedResult =
      await pendingSubscriptionsFromCache.getPendingSubscriptions(
        mockUser.id,
        "courts"
      );
    expect(cachedResult).toStrictEqual(mockCourt);
  });

  it("should remove a court record from the cache", async () => {
    await pendingSubscriptionsFromCache.removeFromCache({ court: "643" }, "1");
    sinon.assert.called(set);
    sinon.assert.called(getStub);
  });

  it("should remove a case record from the cache", async () => {
    await pendingSubscriptionsFromCache.removeFromCache(
      { case: "T485914" },
      "1"
    );
    sinon.assert.called(set);
    sinon.assert.called(getStub);
  });
});
