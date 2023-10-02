import * as TestingSupportAPI from '../testingSupportApi';

const Helper = require('@codeceptjs/helper');
type TestingSupportAPI = typeof TestingSupportAPI;

class TestingSupportApi extends Helper implements TestingSupportAPI {
    createLocation = TestingSupportAPI.createLocation;
    createSubscription = TestingSupportAPI.createSubscription;
    uploadPublication = TestingSupportAPI.uploadPublication;
    createSystemAdminAccount = TestingSupportAPI.createSystemAdminAccount;
    deletePublicationByArtefactId = TestingSupportAPI.deletePublicationByArtefactId;
    clearTestData = TestingSupportAPI.clearTestData;
    createMaxSystemAdminAccounts = TestingSupportAPI.createMaxSystemAdminAccounts;
    createTestUserAccount = TestingSupportAPI.createTestUserAccount;
}

export = TestingSupportApi;
