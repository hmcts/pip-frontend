import { SjpRequests } from '../../../main/resources/requests/sjpRequests';

const firstSJPCase = {
    Name: 'A Morley',
    Town: 'Aberdeen',
    County: '',
    Postcode: 'AB',
    Offence: 'Keep a vehicle without a valid vehicle licence',
    Prosecutor: 'Driver and Vehicle Licensing Agency',
};
const totalCases = 2366;
const sjpRequests = new SjpRequests();

describe('getSJPCases request', () => {
    const casesList = sjpRequests.getSJPCases();
    const randomCase = casesList[Math.floor(Math.random() * casesList.length)];

    it('should return list of SJP cases', () => {
        expect(casesList.length).toBe(totalCases);
    });

    it('should contain s SJP case', () => {
        expect(casesList.some(e => e.Name === firstSJPCase.Name)).toBeTruthy();
    });

    it(`should contain an object with a name ${randomCase.Name} with all attributes`, () => {
        expect(Object.keys(randomCase)).toStrictEqual(Object.keys(firstSJPCase));
    });
});
