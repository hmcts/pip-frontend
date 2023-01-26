import sinon from "sinon";
import { Response } from "express";
import fs from "fs";
import path from "path";
import SubscriptionUrnSearchController from "../../../main/controllers/SubscriptionUrnSearchController";
import { mockRequest } from "../mocks/mockRequest";
import { PublicationService } from "../../../main/service/publicationService";

const subscriptionUrnSearchController = new SubscriptionUrnSearchController();
const rawData = fs.readFileSync(
  path.resolve(__dirname, "../mocks/subscriptionListResult.json"),
  "utf-8"
);
const subscriptionResult = JSON.parse(rawData);
const stub = sinon.stub(PublicationService.prototype, "getCaseByCaseUrn");
const i18n = { "subscription-urn-search": {} };

describe("Subscriptions Urn Search Controller", () => {
  const response = {
    render: function () {
      return "";
    },
  } as unknown as Response;
  const request = mockRequest(i18n);
  request.user = { userId: "1" };

  it("should render the search page", async () => {
    const responseMock = sinon.mock(response);

    responseMock
      .expects("render")
      .once()
      .withArgs("subscription-urn-search", {
        ...i18n["subscription-urn-search"],
      });
    await subscriptionUrnSearchController.get(request, response);
    responseMock.verify();
  });

  it("should render urn search page if there are no matching results", async () => {
    stub.withArgs("12345678").returns(null);
    const response = {
      render: () => {
        return "";
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { "search-input": "12345678" };
    const responseMock = sinon.mock(response);
    const expectedResults = {
      ...i18n["subscription-urn-search"],
      invalidInputError: false,
      noResultsError: true,
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("subscription-urn-search", expectedResults);
    await subscriptionUrnSearchController.post(request, response);
    responseMock.verify();
  });

  it("should render urn search page if input is less than three characters long", async () => {
    request.body = { "search-input": "12" };
    const responseMock = sinon.mock(response);
    const expectedResults = {
      ...i18n["subscription-urn-search"],
      invalidInputError: false,
      noResultsError: true,
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("subscription-urn-search", expectedResults);
    await subscriptionUrnSearchController.post(request, response);
    responseMock.verify();
  });

  it("should render urn search page if input is three characters long and partially correct", async () => {
    stub.withArgs("1234").returns(null);
    const response = {
      render: () => {
        return "";
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { "search-input": "1234" };
    const responseMock = sinon.mock(response);
    const expectedResults = {
      ...i18n["subscription-urn-search"],
      invalidInputError: false,
      noResultsError: true,
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("subscription-urn-search", expectedResults);
    await subscriptionUrnSearchController.post(request, response);
    responseMock.verify();
  });

  it("should render urn search page if no input is provided", () => {
    stub.withArgs("").returns(null);
    const response = {
      render: () => {
        return "";
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { "search-input": "" };
    const responseMock = sinon.mock(response);
    const expectedResults = {
      ...i18n["subscription-urn-search"],
      invalidInputError: true,
      noResultsError: false,
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("subscription-urn-search", expectedResults);
    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it("should redirect to urn search results page with input as query if urn input is valid", async () => {
    const response = {
      redirect: () => {
        return "";
      },
      render: () => {
        return "";
      },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { "search-input": "123456789" };
    const responseMock = sinon.mock(response);
    stub.withArgs("123456789").returns(subscriptionResult);

    responseMock
      .expects("redirect")
      .once()
      .withArgs("subscription-urn-search-results?search-input=123456789");
    await subscriptionUrnSearchController.post(request, response);
    responseMock.verify();
  });
});
