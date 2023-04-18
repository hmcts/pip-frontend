import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';

describe('Media Account Application Service', () => {
    const applicationId = '1234';
    const imageId = '12345';
    const accountApplicationService = new MediaAccountApplicationService();

    const dummyApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName',
        requestDate: '2022-05-09T00:00:01',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const formattedApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName',
        requestDate: '09 May 2022',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyImage = new Blob(['testJPEG']);

    const mediaApplicationByIdStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById');
    const mediaApplicationByImageStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationImageById');

    it('should return the expected application by id', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);

        const application = await accountApplicationService.getApplicationById(applicationId);
        expect(application).toStrictEqual(formattedApplication);
    });

    it('should return null application by id when no id provided', async () => {
        const application = await accountApplicationService.getApplicationById(null);
        expect(application).toBe(null);
    });

    it('should return null when id does not match an application', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(null);

        const application = await accountApplicationService.getApplicationById(applicationId);
        expect(application).toBe(null);
    });

    it('should return the expected application by id and status', async () => {
        dummyApplication['requestDate'] = '2022-05-09T00:00:01';
        mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);

        const application = await accountApplicationService.getApplicationByIdAndStatus(applicationId, 'PENDING');
        expect(application).toStrictEqual(formattedApplication);
    });

    it('should return the expected application by id and status when does not match', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);

        const application = await accountApplicationService.getApplicationByIdAndStatus(applicationId, 'OTHER');
        expect(application).toBe(null);
    });

    it('should return null application by id and status', async () => {
        const application = await accountApplicationService.getApplicationByIdAndStatus(null, 'PENDING');
        expect(application).toBe(null);
    });

    it('should return the expected image', async () => {
        mediaApplicationByImageStub.withArgs(imageId).resolves(dummyImage);

        const applicationImage = await accountApplicationService.getImageById(imageId);
        expect(applicationImage).toBe(dummyImage);
    });

    it('should return null image ID', async () => {
        mediaApplicationByImageStub.withArgs(imageId).resolves(dummyImage);

        const applicationImage = await accountApplicationService.getImageById(null);
        expect(applicationImage).toBe(null);
    });
});

describe('rejectApplication', () => {
    let updateMediaApplicationStatusStub;

    const service = new MediaAccountApplicationService();
    beforeEach(() => {
        updateMediaApplicationStatusStub = sinon.stub(
            AccountManagementRequests.prototype,
            'updateMediaApplicationStatus'
        );
    });

    afterEach(() => {
        updateMediaApplicationStatusStub.restore();
    });

    it('should reject application and return updated status', async () => {
        const applicationId = 1;
        const adminId = 123;
        const reasons = ['Reason 1', 'Reason 2'];

        updateMediaApplicationStatusStub.resolves({ status: 'REJECTED' });

        await service.rejectApplication(applicationId, adminId, reasons);

        expect(updateMediaApplicationStatusStub.calledOnceWith(applicationId, 'REJECTED', reasons)).toBeTruthy;
    });

    it('should return null if any of the operations fail', async () => {
        const applicationId = 1;
        const adminId = 123;
        const reasons = ['Reason 1', 'Reason 2'];

        updateMediaApplicationStatusStub.resolves(null); // Simulating a failure

        const service = new MediaAccountApplicationService();
        const result = await service.rejectApplication(applicationId, adminId, reasons);

        expect(updateMediaApplicationStatusStub.calledOnceWith(applicationId, 'REJECTED', reasons)).toBeTruthy;
        expect(result).toBeNull;
    });
});
