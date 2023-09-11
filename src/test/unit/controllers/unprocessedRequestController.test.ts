import sinon from 'sinon';
import {Response} from "express";
import {mockRequest} from "../mocks/mockRequest";
import UnprocessedRequestController from "../../../main/controllers/UnprocessedRequestController";

const unprocessedRequestController = new UnprocessedRequestController();
const i18n = {
    'unprocessed-request': {},
};

describe('Unprocessed Request Controller', () => {
    it('should render unprocessed request page', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const responseMock = sinon.mock(response);
        const request = mockRequest(i18n);

        const expectedOptions = {
            ...i18n['unprocessed-request'],
        };

        responseMock.expects('render').once().withArgs('unprocessed-request', expectedOptions);
        unprocessedRequestController.get(request, response);
        responseMock.verify();
    });
});
