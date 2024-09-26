import sinon from 'sinon';
import { AccountManagementRequests } from '../../../main/resources/requests/AccountManagementRequests';
import { MediaAccountApplicationService } from '../../../main/service/MediaAccountApplicationService';
import fs from 'fs';
import path from 'path';
import { dummyApplication } from '../../helpers/testConsts';
import { CreateAccountService } from '../../../main/service/CreateAccountService';

let mediaApplicationUpdateStatusStub = sinon.stub(AccountManagementRequests.prototype, 'updateMediaApplicationStatus');

describe('Media Account Application Service', () => {
    const applicationId = '1234';
    const imageId = '12345';
    const adminEmail = 'a@b.com';
    const accountApplicationService = new MediaAccountApplicationService();

    const dummyAccount = {
        emailAddress: 'pip-test-1@justice.gov.uk',
        fullName: 'Test Name 1',
    };

    const formattedApplication = {
        id: '1234',
        fullName: 'Test Name 1',
        email: 'pip-test-1@justice.gov.uk',
        employer: 'Test Employer 1',
        image: 'TestImage1',
        imageName: 'TestImage1.jpg',
        requestDate: '09 May 2022',
        status: 'PENDING',
        statusDate: '2022-05-09T00:00:01',
    };

    const approvedApplication = {
        id: '1234',
        fullName: 'Test Name 1',
        email: 'pip-test-1@justice.gov.uk',
        employer: 'Test Employer 1',
        image: '12345',
        imageName: 'TestImage1.jpg',
        requestDate: '2022-05-09T00:00:01',
        status: 'APPROVED',
        statusDate: '2022-05-09T00:00:01',
    };

    const dummyImage = new Blob(['testJPEG']);

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/mediaApplications.json'), 'utf-8');
    const mediaApplications = JSON.parse(rawData);

    sinon.stub(AccountManagementRequests.prototype, 'getPendingMediaApplications').resolves(mediaApplications);

    const mediaApplicationByIdStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById');
    const mediaApplicationByImageStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationImageById');
    const createAccountServiceStub = sinon.stub(CreateAccountService.prototype, 'createMediaAccount');

    it('should return media applications ordered by date', async () => {
        const results = await accountApplicationService.getDateOrderedMediaApplications();
        expect(results[0].fullName).toEqual('Test Name 2');
        expect(results[0].requestDate).toEqual('05 Mar 2022');
        expect(new Date(results[0].requestDate) < new Date(results[1].requestDate)).toBeTruthy();
    });

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

describe('rejectApplication', () => {
    const service = new MediaAccountApplicationService();
    beforeEach(() => {
        mediaApplicationUpdateStatusStub.restore();
        mediaApplicationUpdateStatusStub = sinon.stub(
            AccountManagementRequests.prototype,
            'updateMediaApplicationStatus'
        );
    });

    it('should reject application and return updated status', async () => {
        const applicationId = 1;
        const adminId = 123;
        const reasons = ['Reason 1', 'Reason 2'];

        mediaApplicationUpdateStatusStub.resolves({ status: 'REJECTED' });

        await service.rejectApplication(applicationId, adminId, reasons);

        expect(mediaApplicationUpdateStatusStub.calledOnceWith(applicationId, 'REJECTED', reasons)).toBeTruthy;
    });

    it('should return null if any of the operations fail', async () => {
        const applicationId = 1;
        const adminId = 123;
        const reasons = ['Reason 1', 'Reason 2'];

        mediaApplicationUpdateStatusStub.resolves(null); // Simulating a failure

        const service = new MediaAccountApplicationService();
        const result = await service.rejectApplication(applicationId, adminId, reasons);

        expect(mediaApplicationUpdateStatusStub.calledOnceWith(applicationId, 'REJECTED', reasons)).toBeTruthy;
        expect(result).toBeNull;
    });
});
