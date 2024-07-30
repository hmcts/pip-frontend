import sinon from 'sinon';
import { PublicationService } from '../../../main/service/PublicationService';
import { RemoveListHelperService } from '../../../main/service/RemoveListHelperService';
import { UserManagementService } from '../../../main/service/UserManagementService';
import { expect } from 'chai';

const validArtefactId = '1';
const validArtefactIdSecond = '2';
const validArtefactIdThird = '3';
const invalidArtefactId = '4';
const validArtefactsArray = [validArtefactId, validArtefactIdSecond, validArtefactIdThird];
const invalidArtefactsArray = [validArtefactId, invalidArtefactId, validArtefactIdSecond];
const userId = '123';
const user = { userId: userId };

const removePublicationStub = sinon.stub(PublicationService.prototype, 'removePublication');
let userManagementServiceStub = sinon.stub(UserManagementService.prototype, 'auditAction');
removePublicationStub.withArgs(validArtefactId).resolves(true);
removePublicationStub.withArgs(validArtefactIdSecond).resolves(true);
removePublicationStub.withArgs(validArtefactIdThird).resolves(true);
removePublicationStub.withArgs(invalidArtefactId).resolves(false);

const removeListHelperService = new RemoveListHelperService();
describe('Remove List Helper Service ', () => {

    beforeEach(() => {
        userManagementServiceStub.restore();
        userManagementServiceStub = sinon.stub(UserManagementService.prototype, 'auditAction');
    })

    it('should remove an array of lists', async () => {
        const data = await removeListHelperService.removeLists(validArtefactsArray, user);
        expect(data).to.equal(true);
    });

    it('should remove a single list', async () => {
        const data = await removeListHelperService.removeLists(validArtefactId, user);
        expect(data).to.equal(true);
    });

    it('should fail to remove a single list', async () => {
        const data = await removeListHelperService.removeLists(invalidArtefactId, user);
        expect(data).to.equal(false);
    });

    it('should return false if list removal fails in array', async () => {
        const data = await removeListHelperService.removeLists(invalidArtefactsArray, user);
        expect(data).to.equal(false);
    });

    it('should log to audit if single publication deletion is successful', async () => {
        await removeListHelperService.removeLists(validArtefactId, user);
        sinon.assert.calledOnce(userManagementServiceStub);
        sinon.assert.calledWith(userManagementServiceStub, user,
            'DELETE_PUBLICATION', `Publication with artefact id ${validArtefactId} successfully deleted`);
    });

    it('should log to audit if single publication deletion is unsuccessful', async () => {
        await removeListHelperService.removeLists(invalidArtefactId, user);
        sinon.assert.notCalled(userManagementServiceStub);
    });

    it('should log to audit if array publication deletion is successful', async () => {
        await removeListHelperService.removeLists(validArtefactsArray, user);
        sinon.assert.calledThrice(userManagementServiceStub);
        sinon.assert.calledWith(userManagementServiceStub, user,
            'DELETE_PUBLICATION', `Publication with artefact id ${validArtefactId} successfully deleted`);
        sinon.assert.calledWith(userManagementServiceStub, user,
            'DELETE_PUBLICATION', `Publication with artefact id ${validArtefactIdSecond} successfully deleted`);
        sinon.assert.calledWith(userManagementServiceStub, user,
            'DELETE_PUBLICATION', `Publication with artefact id ${validArtefactIdThird} successfully deleted`);
    });

    it('should log to audit if array publication deletion is unsuccessful', async () => {
        await removeListHelperService.removeLists(invalidArtefactsArray, user);
        sinon.assert.calledOnce(userManagementServiceStub);
        sinon.assert.calledWith(userManagementServiceStub, user,
            'DELETE_PUBLICATION', `Publication with artefact id ${validArtefactId} successfully deleted`);
    });


    it('should return an array of lists from form data when multiple lists are selected', async () => {
        const formData = {
            courtLists: [validArtefactId, validArtefactIdSecond, validArtefactIdThird],
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
