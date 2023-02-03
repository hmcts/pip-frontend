import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { ListParseHelperService } from '../../../main/service/listParseHelperService';

const listParseHelperService = new ListParseHelperService();
const rawDailyCauseData = fs.readFileSync(path.resolve(__dirname, '../mocks/dailyCauseList.json'), 'utf-8');
const dailyCauseListData = JSON.parse(rawDailyCauseData);

describe('List Helper service', () => {
    describe('Publication Date and Time', () => {
        it('should return Publication Time accounting for BST', async () => {
            const data = listParseHelperService.publicationTimeInUkTime(
                dailyCauseListData['document']['publicationDate']
            );
            expect(data).to.equal('12:30am');
        });

        it('should return Publication Date accounting for BST', async () => {
            const data = listParseHelperService.publicationDateInUkTime(
                dailyCauseListData['document']['publicationDate'],
                'en'
            );

            expect(data).to.equal('14 September 2020');
        });
    });

    describe('findAndManipulateLinkedCases', () => {
        it('should format hearing case with multiple linked case', async () => {
            const hearing = {
                case: [
                    {
                        caseNumber: '999',
                        caseLinked: [
                            {
                                caseId: '123',
                            },
                            {
                                caseId: '456',
                            },
                            {
                                caseId: '789',
                            },
                        ],
                    },
                ],
            };
            await listParseHelperService.findAndManipulateLinkedCases(hearing);
            expect(hearing['case'][0]['formattedLinkedCases']).to.equal('123, 456, 789');
        });

        it('should return empty string for hearing case with no linked cases', async () => {
            const hearing = {
                case: [
                    {
                        caseNumber: '999',
                    },
                ],
            };
            await listParseHelperService.findAndManipulateLinkedCases(hearing);
            expect(hearing['case'][0]['formattedLinkedCases']).to.equal('');
        });
    });

    describe('createIndividualDetails', () => {
        it('should create individual details with full name', async () => {
            const individualDetails = {
                individualForenames: 'Forenames',
                individualMiddleName: 'Middlename',
                individualSurname: 'Surname',
                title: 'Mr',
            };
            expect(listParseHelperService.createIndividualDetails(individualDetails, false)).to.equal(
                'Mr Forenames Middlename Surname'
            );
        });

        it('should create individual details with initial', async () => {
            const individualDetails = {
                individualForenames: 'Forenames',
                individualMiddleName: 'Middlename',
                individualSurname: 'Surname',
                title: 'Mr',
            };
            expect(listParseHelperService.createIndividualDetails(individualDetails, true)).to.equal('Mr F. Surname');
        });

        it('should create individual details with surname only', async () => {
            const individualDetails = {
                individualSurname: 'Surname',
            };
            expect(listParseHelperService.createIndividualDetails(individualDetails, false)).to.equal('Surname');
        });
    });
});
