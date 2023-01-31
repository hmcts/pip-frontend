import { expect } from "chai";
import request from "supertest";
import { app } from "../../../main/app";
import fs from "fs";
import path from "path";
import sinon from "sinon";
import { PublicationService } from "../../../main/service/publicationService";

const PAGE_URL = "/sjp-public-list?artefactId=abc";
const headingClass = "govuk-heading-l";
const summaryHeading = "govuk-body";
const tableHeadings = "govuk-table__header";
const sjpTableData = "govuk-table__body";
const buttonClass = "govuk-button";

const expectedHeader =
  "Single Justice Procedure cases that are ready for hearing";
const summaryHeadingText = "List containing 9 case(s)";
const listDate = "25 March 2022";
const offenderName = "CFake";
const offenderPostcode = "BD17";
const offenderProsecutor = "Driver and Vehicle Licensing Agency";
const offenderReason = "Keep a vehicle without a valid vehicle licence";

let htmlRes: Document;

const rawData = fs.readFileSync(
  path.resolve(__dirname, "../mocks/sjp-public-list.json"),
  "utf-8"
);
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(
  path.resolve(__dirname, "../mocks/returnedArtefacts.json"),
  "utf-8"
);
const metaData = JSON.parse(rawMetaData)[0];

sinon
  .stub(PublicationService.prototype, "getIndividualPublicationJson")
  .returns(sjpList);
sinon
  .stub(PublicationService.prototype, "getIndividualPublicationMetadata")
  .returns(metaData);

describe("Single Justice Procedure List page", () => {
  describe("user not signed in", () => {
    beforeAll(async () => {
      await request(app)
        .get(PAGE_URL)
        .then((res) => {
          htmlRes = new DOMParser().parseFromString(res.text, "text/html");
          htmlRes.getElementsByTagName("div")[0].remove();
        });
    });

    it("should display header", () => {
      const header = htmlRes.getElementsByClassName(headingClass);
      expect(header[0].innerHTML).contains(
        expectedHeader,
        "Could not find the header"
      );
    });

    it("should display summary", () => {
      const summary = htmlRes.getElementsByClassName(summaryHeading);
      expect(summary[0].innerHTML).contains(
        summaryHeadingText,
        "Could not find the display summary heading"
      );
      expect(summary[0].innerHTML).contains(
        listDate,
        "Could not find the published date"
      );
    });

    it("should display the search input box", () => {
      const searchInput = htmlRes.getElementsByClassName("govuk-form-group");
      expect(searchInput[0].innerHTML).contains("Search Cases");
    });

    it("should display table headers correctly", () => {
      const tableHeaders = htmlRes.getElementsByClassName(tableHeadings);
      expect(tableHeaders[0].innerHTML).contains("Name");
      expect(tableHeaders[1].innerHTML).contains("Postcode");
      expect(tableHeaders[2].innerHTML).contains("Offence");
      expect(tableHeaders[3].innerHTML).contains("Prosecutor");
    });

    it("should display table data correctly", () => {
      const tableData = htmlRes.getElementsByClassName(sjpTableData);
      expect(tableData[0].innerHTML).contains(
        offenderName,
        "Could not find the offender name"
      );
    });

    it("should have offender postcode", () => {
      const tableData = htmlRes.getElementsByClassName(sjpTableData);
      expect(tableData[0].innerHTML).contains(
        offenderPostcode,
        "Could not find the offender postcode"
      );
    });

    it("should have the correct prosecutor", () => {
      const tableData = htmlRes.getElementsByClassName(sjpTableData);
      expect(tableData[0].innerHTML).contains(
        offenderProsecutor,
        "Could not find the offender's prosecutor"
      );
    });

    it("should have the offence reason", () => {
      const tableData = htmlRes.getElementsByClassName(sjpTableData);
      expect(tableData[0].innerHTML).contains(
        offenderReason,
        "Could not find the offence reason"
      );
    });

    it("should not display the download button", () => {
      const buttons = htmlRes.getElementsByClassName("govuk-button");
      expect(buttons[0]).to.be.undefined;
    });
  });

  describe("signed in as media user", () => {
    beforeAll(async () => {
      app.request["user"] = { roles: "VERIFIED" };

      await request(app)
        .get(PAGE_URL)
        .then((res) => {
          htmlRes = new DOMParser().parseFromString(res.text, "text/html");
          htmlRes.getElementsByTagName("div")[0].remove();
        });
    });

    it("should display the download button", () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0].innerHTML).contains(
        "Download a copy",
        "Could not find the download button"
      );
    });
  });

  describe("signed in as admin user", () => {
    beforeAll(async () => {
      app.request["user"] = { roles: "INTERNAL_SUPER_ADMIN_CTSC" };

      await request(app)
        .get(PAGE_URL)
        .then((res) => {
          htmlRes = new DOMParser().parseFromString(res.text, "text/html");
          htmlRes.getElementsByTagName("div")[0].remove();
        });
    });

    it("should not display the download button", () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0]).to.be.undefined;
    });
  });
});
