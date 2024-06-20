import { checkIfUrl } from '../../../main/helpers/urlHelper';

describe('URL Helper', () => {
    it('should return true if URL', () => {
        expect(checkIfUrl('http://localhost')).toBeTruthy();
    });

    it('should return false if not URL', () => {
        expect(checkIfUrl('abcd')).toBeFalsy();
    });

    it('should return false if null', () => {
        // @ts-ignore Test what happens if a URL was to come through as undefined
        expect(checkIfUrl(undefined)).toBeFalsy();
    });

    it('should return false if empty', () => {
        expect(checkIfUrl('')).toBeFalsy();
    });
});
