import {
    deleteLocation
} from './../shared/testingSupportApi';

Feature('Delete Location');

Scenario('I as a system admin should be able to delete court', async ({ I }) => {
    await deleteLocation('15');
});
