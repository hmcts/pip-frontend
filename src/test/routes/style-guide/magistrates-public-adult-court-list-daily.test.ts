import request from 'supertest';
import sinon from 'sinon';

import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/PublicationService';
import { LocationService } from '../../../main/service/LocationService';
import { testArtefactJsonData, testArtefactMetadata, testLocationData } from '../../a11y/common/testData';

const artefactId = 'abc';
const route = `/magistrates-public-adult-court-list-daily?artefactId=${artefactId}`;

const jsonData = testArtefactJsonData('magistratesPublicAdultCourtListDaily.json');
const metadata = testArtefactMetadata()[0];
metadata.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';
const locationData = testLocationData();

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').resolves(jsonData);
sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata').resolves(metadata);
sinon.stub(LocationService.prototype, 'getLocationById').resolves(locationData[0]);

describe('Magistrates Public Adult Court List Page', () => {
    it('should render the magistrates public adult court list page', async () => {
        const res = await request(app).get(route);
        expect(res.status).toBe(200);
        expect(res.text).toContain('Magistrates Public List');
    });
});
