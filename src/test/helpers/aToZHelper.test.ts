import { AToZHelper } from '../../main/helpers/aToZHelper';

describe('A to Z Helper', () => {
    it('should generate the alphabet object', () => {
        const alphabetObject = AToZHelper.generateAlphabetObject();
        expect(Object.keys(alphabetObject).length).toBe(26);
        expect(alphabetObject['A']).toStrictEqual({});
    });
});
