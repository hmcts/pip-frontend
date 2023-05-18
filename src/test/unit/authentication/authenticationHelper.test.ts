import { expect } from 'chai';
import {
    checkRoles,
    manualUploadRoles,
    mediaAccountCreationRoles,
} from '../../../main/authentication/authenticationHelper';

describe('Test checking user roles', () => {
    it('check that check roles returns true when matched', () => {
        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        expect(checkRoles(req, manualUploadRoles)).to.be.true;
    });

    it('check that check roles returns false when matched', () => {
        const req = { user: { roles: 'SYSTEM_ADMIN' } };
        expect(checkRoles(req, mediaAccountCreationRoles)).to.be.false;
    });

    it('check that roles returns false when no user', () => {
        expect(checkRoles({}, mediaAccountCreationRoles)).to.be.false;
    });

    it('check that roles returns false when no roles', () => {
        expect(checkRoles({ user: {} }, mediaAccountCreationRoles)).to.be.false;
    });
});
