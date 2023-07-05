import * as TestingSupportAPI from '../testingSupportApi';

const Helper = require('@codeceptjs/helper');
type TestingSupportAPI = typeof TestingSupportAPI;

class TestingSupportApi extends Helper implements TestingSupportAPI {
    deleteLocation = TestingSupportAPI.deleteLocation;
    createLocation = TestingSupportAPI.createLocation;
    createSubscription = TestingSupportAPI.createSubscription;
    deleteSubscription = TestingSupportAPI.deleteSubscription;
    uploadPublication = TestingSupportAPI.uploadPublication;
    deletePublicationForCourt = TestingSupportAPI.deletePublicationForCourt;
    createSystemAdminAccount = TestingSupportAPI.createSystemAdminAccount;
    deletePublicationByArtefactId = TestingSupportAPI.deletePublicationByArtefactId;
    clearTestData = TestingSupportAPI.clearTestData;
    clearAllPublicationsByTestPrefix = TestingSupportAPI.clearAllPublicationsByTestPrefix;
    clearAllSubscriptionsByTestPrefix = TestingSupportAPI.clearAllSubscriptionsByTestPrefix;
    clearAllLocationsByTestPrefix = TestingSupportAPI.clearAllLocationsByTestPrefix;
    clearAllAccountsByTestPrefix = TestingSupportAPI.clearAllAccountsByTestPrefix;
    clearAllMediaApplicationsByTestPrefix = TestingSupportAPI.clearAllMediaApplicationsByTestPrefix;
}

export = TestingSupportApi;
