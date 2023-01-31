import * as supertest from "supertest";
import sinon from "sinon";
import { app } from "../../main/app";
import {
  ensurePageCallWillSucceed,
  expectNoErrors,
  Pa11yResult,
  runPally,
} from "./a11y";
import { PublicationService } from "../../main/service/publicationService";
import fs from "fs";
import path from "path";
import { LocationService } from "../../main/service/locationService";
const agent = supertest.agent(app);

const URL = "/daily-cause-list?artefactId=abc";
const rawData = fs.readFileSync(
  path.resolve(__dirname, "../unit/mocks/dailyCauseList.json"),
  "utf-8"
);
const dailyCauseListData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(
  path.resolve(__dirname, "../unit/mocks/returnedArtefacts.json"),
  "utf-8"
);
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(
  path.resolve(__dirname, "../unit/mocks/courtAndHearings.json"),
  "utf-8"
);
const courtData = JSON.parse(rawDataCourt);

describe("Accessibility Civil Daily Cause List Page Error States", () => {
  beforeEach(() => {
    sinon
      .stub(PublicationService.prototype, "getIndividualPublicationJson")
      .returns(dailyCauseListData);
    sinon
      .stub(PublicationService.prototype, "getIndividualPublicationMetadata")
      .returns(metaData);
    sinon
      .stub(LocationService.prototype, "getLocationById")
      .resolves(courtData[0]);
  });

  afterEach(() => {
    sinon.restore();
  });

  test("should have no accessibility errors for input data", (done) => {
    ensurePageCallWillSucceed(URL)
      .then(() => runPally(agent.get(URL).url))
      .then((result: Pa11yResult) => {
        expectNoErrors(result.issues);
        done();
      })
      .catch((err: Error) => done(err));
  });
});
