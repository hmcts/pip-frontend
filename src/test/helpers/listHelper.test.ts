import { isValidList } from '../../main/helpers/listHelper';
import { HttpStatusCode } from 'axios';

describe('List Helper', () => {
    it('should return true if the list is valid', () => {
        const searchResults = 'Test data';
        const metaData = 'Test data';

        expect(isValidList(searchResults, metaData)).toBe(true);
    });

    it('should return false if the list is not valid', () => {
        const searchResults = null;
        const metaData = null;

        expect(isValidList(searchResults, metaData)).toBe(true);
    });

    it('should return false if the status codes are 404', () => {
        const searchResults = HttpStatusCode.NotFound;
        const metaData = HttpStatusCode.NotFound;

        expect(isValidList(searchResults, metaData)).toBe(true);
    });
});
