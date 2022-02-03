import ListOptionController from '../../../main/controllers/ListOptionController';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import sinon from 'sinon';
import {PublicationService} from '../../../main/service/publicationService';
import fs from "fs";
import path from "path";

const publicationController = new ListOptionController();
const i18n = {
  'list-option': {},
};
const rawSJPData = fs.readFileSync(path.resolve(__dirname, '../mocks/trimmedSJPCases.json'), 'utf-8');
const sjpCases = JSON.parse(rawSJPData).results;

describe('Get publications', () => {
  it('should render the Summary of Publications page', async () => {
    sinon.stub(PublicationService.prototype, 'getPublications').resolves(sjpCases);
    const response = { render: () => {return '';}} as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {courtId: '1'};
    request.user = {id: 1};

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['summary-of-publications'],
      courtName: '1',
      publications:sjpCases,
    };

    responseMock.expects('render').once().withArgs('summary-of-publications', expectedData);

    await publicationController.get(request, response);
    responseMock.verify();
  });

  it('should redirect to the hearing list page', () => {
    const response = {
      redirect: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);
    request.query = {courtId: '1'};
    request.user = undefined;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('hearing-list?courtId=1');

    return publicationController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
