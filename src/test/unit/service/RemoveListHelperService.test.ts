import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import { RemoveListHelperService } from '../../../main/service/RemoveListHelperService';
import { expect } from 'chai';

const validArtefactId = '1';
const invalidArtefactId = '4';
const validArtefactsArray = [validArtefactId, validArtefactId, validArtefactId];
const invalidArtefactsArray = [validArtefactId, invalidArtefactId, validArtefactId];
const userId = '123';

const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
removePublicationStub.withArgs(validArtefactId).resolves(true);
removePublicationStub.withArgs(invalidArtefactId).resolves(false);

const removeListHelperService = new RemoveListHelperService();
describe('Remove List Helper Service ', () => {
    it('should remove an array of lists', async () => {
        const data = await removeListHelperService.removeLists(validArtefactsArray, userId);
        expect(data).to.equal(true);
    });

    it('should remove a single list', async () => {
        const data = await removeListHelperService.removeLists(validArtefactId, userId);
        expect(data).to.equal(true);
    });

    it('should return false if list removal fails', async () => {
        const data = await removeListHelperService.removeLists(invalidArtefactsArray, userId);
        expect(data).to.equal(false);
    });

    it('should format audit text for removing multiple lists', async () => {
        const data = removeListHelperService.formatArtefactIdsForAudit(validArtefactsArray);
        expect(data).to.equal('Publications with artefact ids 1, 1, 1 successfully deleted');
    });

    it('should format audit text for removing a single list', async () => {
        const data = removeListHelperService.formatArtefactIdsForAudit(validArtefactId);
        expect(data).to.equal('Publication with artefact id 1 successfully deleted');
    });

    it('should return an array of lists from form data when multiple lists are selected', async () => {
        const formData = {
            courtLists: [validArtefactId, validArtefactId, validArtefactId],
            locationId: '5',
        };
        const data = removeListHelperService.getSelectedLists(formData);
        expect(data).to.eql(validArtefactsArray);
    });

    it('should return an array of lists from form data when a single list is selected', async () => {
        const formData = {
            courtLists: validArtefactId,
            locationId: '5',
        };
        const data = removeListHelperService.getSelectedLists(formData);
        expect(data).to.eql([validArtefactId]);
    });

    it('should return an empty array if form data contains no lists', async () => {
        const formData = {
            courtLists: undefined,
            locationId: '5',
        };
        const data = removeListHelperService.getSelectedLists(formData);
        expect(data).to.eql([]);
    });
});
