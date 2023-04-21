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
    deleteAllAccountsByEmailAndRoles = TestingSupportAPI.deleteAllAccountsByEmailAndRoles;
}

export = TestingSupportApi;
