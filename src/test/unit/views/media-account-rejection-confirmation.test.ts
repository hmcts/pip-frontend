import { app } from "../../../main/app";
import request from "supertest";
import { expect } from "chai";
import sinon from "sinon";
import { MediaAccountApplicationService } from "../../../main/service/mediaAccountApplicationService";

let htmlRes: Document;

describe("Media Account Submission Page", () => {
  const applicationId = "1234";

  const PAGE_URL =
    "/media-account-rejection-confirmation?applicantId=" + applicationId;
  const panelClass = "govuk-panel__title";
  const summaryHeader = "govuk-summary-list__key";
  const summaryCell = "govuk-summary-list__value";
  const bottomHeaderClass = "govuk-heading-m";
  const bottomSummaryClass = "govuk-body";
  const bottomContentClass = "govuk-inset-text";

  const expectedPanel = "Account has been rejected";
  const nameHeader = "Name";
  const nameValue = "Test Name";
  const emailHeader = "Email";
  const emailValue = "a@b.com";
  const employerHeader = "Employer";
  const employerValue = "employer";
  const appliedHeader = "Date applied";
  const appliedValue = "09 May 2022";
  const bottomHeader = "What happens next";
  const bottomContent =
    "Your request for a court and tribunal hearings account has been rejected for the following reason(s)";

  const dummyApplication = {
    id: "1234",
    fullName: "Test Name",
    email: "a@b.com",
    employer: "employer",
    image: "12345",
    imageName: "ImageName.jpg",
    requestDate: "09 May 2022",
    status: "REJECTED",
    statusDate: "2022-05-09T00:00:01",
  };

  app.request["user"] = { email: "emailA", roles: "INTERNAL_SUPER_ADMIN_CTSC" };

  sinon
    .stub(MediaAccountApplicationService.prototype, "getApplicationById")
    .returns(dummyApplication);

  beforeAll(async () => {
    await request(app)
      .get(PAGE_URL)
      .then((res) => {
        htmlRes = new DOMParser().parseFromString(res.text, "text/html");
        htmlRes.getElementsByTagName("div")[0].remove();
      });
  });

  it("should display panel", () => {
    const header = htmlRes.getElementsByClassName(panelClass);
    expect(header[0].innerHTML).contains(
      expectedPanel,
      "Could not find the panel"
    );
  });

  it("should display name header", () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[0].innerHTML).contains(
      nameHeader,
      "Could not find the name header"
    );
  });

  it("should display name value", () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[0].innerHTML).contains(
      nameValue,
      "Could not find the name value"
    );
  });

  it("should display email header", () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[1].innerHTML).contains(
      emailHeader,
      "Could not find the email header"
    );
  });

  it("should display the summary email value", () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    const anchorTag = value[1].getElementsByTagName("a");
    expect(anchorTag[0].innerHTML).contains(
      emailValue,
      "Could not find the email value"
    );
  });

  it("should display the summary email mail to", () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    const anchorTag = value[1].getElementsByTagName("a");
    expect(anchorTag[0].getAttribute("href")).contains(
      "mailto:a@b.com?subject=Your%20request%20for%20a%20Court%20and%20tribunal%20hearings%20account.",
      "Could not find the mail to"
    );
  });

  it("should display employer header", () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[2].innerHTML).contains(
      employerHeader,
      "Could not find the employer header"
    );
  });

  it("should display employer value", () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[2].innerHTML).contains(
      employerValue,
      "Could not find the employer value"
    );
  });

  it("should display date applied header", () => {
    const header = htmlRes.getElementsByClassName(summaryHeader);
    expect(header[3].innerHTML).contains(
      appliedHeader,
      "Could not find the date applied header"
    );
  });

  it("should display date applied value", () => {
    const value = htmlRes.getElementsByClassName(summaryCell);
    expect(value[3].innerHTML).contains(
      appliedValue,
      "Could not find the date applied value"
    );
  });

  it("should display the bottom header", () => {
    const header = htmlRes.getElementsByClassName(bottomHeaderClass);
    expect(header[0].innerHTML).contains(
      bottomHeader,
      "Could not find the bottom header"
    );
  });

  it("should display the bottom mail to", () => {
    const bottomSummary = htmlRes.getElementsByClassName(bottomSummaryClass);
    const bottomEmail = bottomSummary[0].getElementsByTagName("a");
    expect(bottomEmail[0].getAttribute("href")).contains(
      "mailto:a@b.com?subject=Your%20request%20for%20a%20Court%20and%20tribunal%20hearings%20account.",
      "Could not find the mail to"
    );
  });

  it("should display the bottom content reason title", () => {
    const bottomElement = htmlRes.getElementsByClassName(bottomContentClass);
    expect(bottomElement[0].innerHTML).contains(
      bottomContent,
      "Could not find the bottom content"
    );
  });

  it("should display link back to the create media account page", () => {
    const bottomElement = htmlRes.getElementsByClassName(bottomContentClass);
    const header = bottomElement[0].getElementsByTagName("a");
    expect(header[0].getAttribute("href")).contains(
      "/create-media-account",
      "Could not find the link back to create media account"
    );
  });
});
