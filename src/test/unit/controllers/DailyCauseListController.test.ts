import sinon from "sinon";
import { Response } from "express";
import DailyCauseListController from "../../../main/controllers/DailyCauseListController";
import fs from "fs";
import path from "path";
import { PublicationService } from "../../../main/service/publicationService";
import { mockRequest } from "../mocks/mockRequest";
import { DateTime } from "luxon";
import { LocationService } from "../../../main/service/locationService";
import { civilFamilyAndMixedListService } from "../../../main/service/listManipulation/CivilFamilyAndMixedListService";

const rawData = fs.readFileSync(
  path.resolve(__dirname, "../mocks/familyDailyCauseList.json"),
  "utf-8"
);
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(
  path.resolve(__dirname, "../mocks/returnedArtefacts.json"),
  "utf-8"
);
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(
  path.resolve(__dirname, "../mocks/courtAndHearings.json"),
  "utf-8"
);
const courtData = JSON.parse(rawDataCourt);

const dailyCauseListController = new DailyCauseListController();

const dailyCauseListJsonStub = sinon.stub(
  PublicationService.prototype,
  "getIndividualPublicationJson"
);
const dailyCauseListMetaDataStub = sinon.stub(
  PublicationService.prototype,
  "getIndividualPublicationMetadata"
);
sinon.stub(LocationService.prototype, "getLocationById").resolves(courtData[0]);
sinon
  .stub(
    civilFamilyAndMixedListService.prototype,
    "sculptedCivilFamilyMixedListData"
  )
  .returns(listData);

const artefactId = "abc";

dailyCauseListJsonStub.withArgs(artefactId).resolves(listData);
dailyCauseListJsonStub.withArgs("").resolves([]);

dailyCauseListMetaDataStub.withArgs(artefactId).resolves(metaData);
dailyCauseListMetaDataStub.withArgs("").resolves([]);

const i18n = {
  "daily-cause-list": {},
  "list-template": {},
};

describe("Daily Cause List Controller", () => {
  const response = {
    render: () => {
      return "";
    },
  } as unknown as Response;
  const request = mockRequest(i18n);
  request.path = "/daily-cause-list";

  afterEach(() => {
    sinon.restore();
  });

  it("should render the daily cause list page", async () => {
    request.query = { artefactId: artefactId };
    request.user = { userId: "1" };

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n["daily-cause-list"],
      ...i18n["list-template"],
      listData,
      contentDate: DateTime.fromISO(metaData["contentDate"], {
        zone: "utc",
      }).toFormat("dd MMMM yyyy"),
      publishedDate: "14 September 2020",
      courtName: "Abergavenny Magistrates' Court",
      publishedTime: "12:30am",
      provenance: "prov1",
      bill: false,
    };

    responseMock
      .expects("render")
      .once()
      .withArgs("daily-cause-list", expectedData);

    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });

  it("should render error page is query param is empty", async () => {
    request.query = {};
    request.user = { userId: "1" };
    const responseMock = sinon.mock(response);

    responseMock
      .expects("render")
      .once()
      .withArgs("error", request.i18n.getDataByLanguage(request.lng).error);

    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });

  it("should render error page if list is not allowed to view by the user", async () => {
    request.query = { artefactId: artefactId };
    const responseMock = sinon.mock(response);

    responseMock
      .expects("render")
      .once()
      .withArgs("error", request.i18n.getDataByLanguage(request.lng).error);

    await dailyCauseListController.get(request, response);
    return responseMock.verify();
  });
});
