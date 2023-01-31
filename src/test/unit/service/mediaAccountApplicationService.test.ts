import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import { MediaAccountApplicationService } from '../../../main/service/mediaAccountApplicationService';
import { CreateAccountService } from '../../../main/service/createAccountService';
import { dummyApplication } from '../../helpers/testConsts';

describe('Summary Of Publications Service', () => {
    const applicationId = '1234';
    const imageId = '12345';
    const adminEmail = 'a@b.com';
    const accountApplicationService = new MediaAccountApplicationService();

    const dummyAccount = {
        emailAddress: 'a@b.com',
        fullName: 'Test Name',
    };

    const approvedApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.jpg',
        requestDate: '2022-05-09T00:00:01',
        status: 'APPROVED',
        statusDate: '2022-05-09T00:00:01',
    };

    const formattedApplication = {
        id: '1234',
        fullName: 'Test Name',
        email: 'a@b.com',
        employer: 'Employer',
        image: '12345',
        imageName: 'ImageName.jpg',
        requestDate: '09 May 2022',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyImage = new Blob(['testJPEG']);

    const mediaApplicationByIdStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById');
    const mediaApplicationByImageStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationImageById');
    const mediaApplicationUpdateStatusStub = sinon.stub(
        AccountManagementRequests.prototype,
        'updateMediaApplicationStatus'
    );
    const createAccountServiceStub = sinon.stub(CreateAccountService.prototype, 'createMediaAccount');

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

    it('should return the expected application when successfully created', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);
        createAccountServiceStub.withArgs(applicationId, adminEmail).resolves(dummyApplication);
        mediaApplicationUpdateStatusStub.withArgs(applicationId, 'APPROVED').resolves(approvedApplication);

        const application = await accountApplicationService.createAccountFromApplication(applicationId, adminEmail);
        expect(application).toBe(approvedApplication);
        sinon.assert.calledWith(createAccountServiceStub, dummyAccount, adminEmail);
    });

    it('should return null when application does not exist', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(null);

        const application = await accountApplicationService.createAccountFromApplication(applicationId, adminEmail);
        expect(application).toBe(null);
    });

    it('should return null when application fails to persist', async () => {
        mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);
        createAccountServiceStub.withArgs(applicationId, adminEmail).resolves(dummyApplication);
        mediaApplicationUpdateStatusStub.withArgs(applicationId, 'APPROVED').resolves(null);

        const application = await accountApplicationService.createAccountFromApplication(applicationId, adminEmail);
        expect(application).toBe(null);
        sinon.assert.calledWith(createAccountServiceStub, dummyAccount, adminEmail);
    });
});
