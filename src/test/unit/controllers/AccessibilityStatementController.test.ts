import { mockRequest } from '../mocks/mockRequest';
import { Response } from 'express';
import sinon from 'sinon';
import AccessibilityStatementController from '../../../main/controllers/AccessibilityStatementController';

const accessibilityStatementController = new AccessibilityStatementController();

describe('Accessibility Statement Page controller', () => {
    it('should render accessibility statement page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest({ 'accessibility-statement': {} });
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs(
                'accessibility-statement',
                request.i18n.getDataByLanguage(request.lng)['accessibility-statement']
            );
        await accessibilityStatementController.get(request, response);
        await responseMock.verify();
    });
});
