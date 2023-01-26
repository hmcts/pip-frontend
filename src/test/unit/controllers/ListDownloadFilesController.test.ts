import ListDownloadFilesController from "../../../main/controllers/ListDownloadFilesController";
import sinon from "sinon";
import fs from "fs";
import { Response } from "express";
import { mockRequest } from "../mocks/mockRequest";
import { ListDownloadService } from "../../../main/service/listDownloadService";

const listDownloadFilesController = new ListDownloadFilesController();

describe("List Download Disclaimer Controller", () => {
  const i18n = {
    "list-download-files": {},
    error: {},
  };

  const url = "list-download-files";

  const request = mockRequest(i18n);
  const response = {
    render: () => {
      return "";
    },
    send: () => {
      return "";
    },
    setHeader: () => {
      return "";
    },
  } as unknown as Response;

  jest.mock("fs");
  const generateFilesStub = sinon.stub(
    ListDownloadService.prototype,
    "generateFiles"
  );
  const getFileSizeStub = sinon.stub(
    ListDownloadService.prototype,
    "getFileSize"
  );

  afterEach(() => {
    sinon.restore();
  });

  it("should render the list download files page", () => {
    generateFilesStub.resolves({});
    getFileSizeStub.withArgs("123", "pdf").returns("650.0KB");
    getFileSizeStub.withArgs("123", "excel").returns("200.0KB");

    request.query = { artefactId: "123" };
    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n[url],
      artefactId: "123",
      pdfFileSize: "650.0KB",
      excelFileSize: "200.0KB",
    };
    responseMock.expects("render").once().withArgs(url, expectedData);

    listDownloadFilesController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it("should render the error page if no files generated", () => {
    generateFilesStub.resolves(null);

    request.query = { artefactId: "123" };
    const responseMock = sinon.mock(response);
    responseMock.expects("render").once().withArgs("error", i18n.error);

    listDownloadFilesController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it("should set response headers when downloading PDF", () => {
    sinon.stub(ListDownloadService.prototype, "getFile").returns("test.pdf");
    sinon.stub(fs, "createReadStream").returns({
      pipe: sinon.stub().returns({}),
    });

    request.query = { type: "pdf", artefactId: "123" };
    const responseMock = sinon.mock(response);

    responseMock
      .expects("setHeader")
      .once()
      .withArgs("Content-disposition", "attachment; filename=test.pdf");
    responseMock
      .expects("setHeader")
      .once()
      .withArgs("Content-type", "application/pdf");

    listDownloadFilesController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it("should set response headers when downloading Excel spreadsheet", () => {
    sinon.stub(ListDownloadService.prototype, "getFile").returns("test.xlsx");
    sinon.stub(fs, "createReadStream").returns({
      pipe: sinon.stub().returns({}),
    });

    request.query = { type: "excel", artefactId: "123" };
    const responseMock = sinon.mock(response);

    responseMock
      .expects("setHeader")
      .once()
      .withArgs("Content-disposition", "attachment; filename=test.xlsx");
    responseMock
      .expects("setHeader")
      .once()
      .withArgs(
        "Content-type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );

    listDownloadFilesController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it("should render the error page if no file returned", () => {
    sinon.stub(ListDownloadService.prototype, "getFile").returns(null);

    request.query = { artefactId: "123" };
    const responseMock = sinon.mock(response);
    responseMock.expects("render").once().withArgs("error", i18n.error);

    listDownloadFilesController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
