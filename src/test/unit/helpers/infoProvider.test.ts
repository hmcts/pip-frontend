import { getInfo } from '../../../main/helpers/infoProvider';

describe('Info Provider', () => {
    //Limited amount that can be tested here due to the method just returning an imported function,
    //however added this test which provides a basic check that a function is returned.
    it('Should provide the info provider function', () => {
        const getInfoProviderFunction = getInfo();
        expect(typeof getInfoProviderFunction).toBe('function');
    });
});
