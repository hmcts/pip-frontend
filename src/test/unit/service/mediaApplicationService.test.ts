import sinon from 'sinon';
import { MediaApplicationService } from '../../../main/service/mediaApplicationService';
import { AccountManagementRequests } from '../../../main/resources/requests/accountManagementRequests';
import fs from 'fs';
import path from 'path';

const mediaApplicationService = new MediaApplicationService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/mediaApplications.json'), 'utf-8');
const mediaApplications = JSON.parse(rawData);

sinon.stub(AccountManagementRequests.prototype, 'getPendingMediaApplications').resolves(mediaApplications);

describe('Media application service', () => {
    it('should return media applications ordered by date', async () => {
        const results = await mediaApplicationService.getDateOrderedMediaApplications();
        expect(results[0].fullName).toEqual('jack jackson');
        expect(results[0].requestDate).toEqual('05 Mar 2022');
        expect(new Date(results[0].requestDate) < new Date(results[1].requestDate)).toBeTruthy();
    });
});
