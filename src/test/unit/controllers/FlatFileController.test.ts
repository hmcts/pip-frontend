import sinon from 'sinon';
import { Response } from 'express';
import { PublicationService } from '../../../main/service/publicationService';
import FlatFileController from '../../../main/controllers/FlatFileController';
import { mockRequest } from '../mocks/mockRequest';

const metaStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const fileStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationFile');

const mockFile = new Blob(['testFile']);
const i18n = {};
const response = {
    send: function () {
        return '';
    },
    set: function () {
        return '';
    },
} as unknown as Response;

describe('Flat File Controller', () => {
    const flatFileController = new FlatFileController();

    it('should return a pdf when appropriate', () => {
        metaStub.withArgs('0').resolves({ isFlatFile: 'true', sourceArtefactId: 'doc.pdf' });
        fileStub.withArgs('0').resolves(mockFile);
        const request = mockRequest(i18n);
        request.query = { artefactId: '0' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);
        responseMock.expects('send').once().withArgs(mockFile);
        return flatFileController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
    it('should return a docx file when appropriate', () => {
        metaStub.withArgs('1').resolves({ isFlatFile: 'true', sourceArtefactId: 'doc.docx' });
        fileStub.withArgs('1').resolves(mockFile);
        const request = mockRequest(i18n);
        request.query = { artefactId: '1' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);
        responseMock.expects('send').once().withArgs(mockFile);
        return flatFileController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
    it('should return a json file when appropriate', () => {
        metaStub.withArgs('2').resolves({ isFlatFile: 'true', sourceArtefactId: 'doc.json' });
        fileStub.withArgs('2').resolves(mockFile);
        const request = mockRequest(i18n);
        request.query = { artefactId: '2' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);
        responseMock.expects('send').once().withArgs(mockFile);
        return flatFileController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
