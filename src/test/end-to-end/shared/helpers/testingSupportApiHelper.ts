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
    clearAllAccountsByTestPrefix = TestingSupportAPI.clearAllAccountsByTestPrefix;
    deletePublicationByArtefactId = TestingSupportAPI.deletePublicationByArtefactId;
    clearTestData = TestingSupportAPI.clearTestData;
    clearAllPublicationsByTestPrefix = TestingSupportAPI.clearAllPublicationsByTestPrefix;
    clearAllSubscriptionsByTestPrefix = TestingSupportAPI.clearAllSubscriptionsByTestPrefix;
    clearAllLocationsByTestPrefix = TestingSupportAPI.clearAllLocationsByTestPrefix;
    clearAllMediaApplicationssByTestPrefix = TestingSupportAPI.clearAllMediaApplicationssByTestPrefix;
}

export = TestingSupportApi;
