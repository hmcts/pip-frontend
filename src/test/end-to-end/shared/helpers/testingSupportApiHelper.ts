import * as TestingSupportAPI from '../testingSupportApi';
import Helper from '@codeceptjs/helper';

type TestingSupportAPI = typeof TestingSupportAPI;

export default class TestingSupportApi extends Helper implements TestingSupportAPI {
    createLocation = TestingSupportAPI.createLocation;
    createSubscription = TestingSupportAPI.createSubscription;
    uploadPublication = TestingSupportAPI.uploadPublication;
    createSystemAdminAccount = TestingSupportAPI.createSystemAdminAccount;
    deletePublicationByArtefactId = TestingSupportAPI.deletePublicationByArtefactId;
    clearTestData = TestingSupportAPI.clearTestData;
    createMaxSystemAdminAccounts = TestingSupportAPI.createMaxSystemAdminAccounts;
    createTestUserAccount = TestingSupportAPI.createTestUserAccount;
    createThirdPartyUserAccount = TestingSupportAPI.createThirdPartyUserAccount;
    deleteThirdPartyUserAccount = TestingSupportAPI.deleteThirdPartyUserAccount;
}
