import sinon from 'sinon';
import {AccountManagementRequests} from '../../../main/resources/requests/accountManagementRequests';
import {MediaAccountApplicationService} from '../../../main/service/mediaAccountApplicationService';

describe('Summary Of Publications Service', () => {

  const applicationId = '1234';
  const imageId = '12345';
  const accountApplicationService = new MediaAccountApplicationService();

  const dummyApplication = {
    'id': '1234',
    'fullName': 'Test Name',
    'email': 'a@b.com',
    'employer': 'Employer',
    'image': '12345',
    'imageName': 'ImageName',
    'requestDate': '2022-05-09T00:00:01',
    'status': 'PENDING',
    'statusDate': '2022-05-09T00:00:01',
  };

  const dummyImage = new Blob(['testJPEG']);

  it('should return the expected application', async () => {
    const mediaApplicationByIdStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationById');
    mediaApplicationByIdStub.withArgs(applicationId).resolves(dummyApplication);

    const application = await accountApplicationService.getApplicationById(applicationId);
    expect(application).toBe(dummyApplication);
  });

  it('should return the expected image', async () => {
    const mediaApplicationByImageStub = sinon.stub(AccountManagementRequests.prototype, 'getMediaApplicationImageById');
    mediaApplicationByImageStub.withArgs(imageId).resolves(dummyImage);

    const applicationImage = await accountApplicationService.getApplicationImageById(imageId);
    expect(applicationImage).toBe(dummyImage);
  });

});
