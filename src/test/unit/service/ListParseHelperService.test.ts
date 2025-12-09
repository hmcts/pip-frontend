import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { ListParseHelperService } from '../../../main/service/ListParseHelperService';

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

    describe('Find and manipulate party details', () => {
        it('should return applicant petitioner details', async () => {
            const partyDetails = {
                party: [
                    {
                        partyRole: 'APPLICANT_PETITIONER',
                        individualDetails: {
                            individualForenames: 'Forenames',
                            individualMiddleName: 'Middlename',
                            individualSurname: 'Surname',
                            title: 'Mr',
                        },
                    },
                    {
                        partyRole: 'APPLICANT_PETITIONER_REPRESENTATIVE',
                        individualDetails: {
                            individualForenames: 'Forenames',
                            individualMiddleName: 'Middlename',
                            individualSurname: 'Surname',
                            title: 'Mr',
                        },
                    },
                    {
                        partyRole: 'CLAIMANT_PETITIONER',
                        individualDetails: {
                            individualForenames: 'Forenames',
                            individualMiddleName: 'Middlename',
                            individualSurname: 'Surname',
                            title: 'Mr',
                        },
                    },
                    {
                        partyRole: 'CLAIMANT_PETITIONER_REPRESENTATIVE',
                        individualDetails: {
                            individualForenames: 'Forenames',
                            individualMiddleName: 'Middlename',
                            individualSurname: 'Surname',
                            title: 'Mr',
                        },
                    },
                    {
                        partyRole: 'RESPONDENT',
                        organisationDetails: {
                            organisationName: 'Organisation Name',
                        },
                    },
                    {
                        partyRole: 'RESPONDENT_REPRESENTATIVE',
                        organisationDetails: {
                            organisationName: 'Organisation Name',
                        },
                    },
                    {
                        partyRole: 'PROSECUTING_AUTHORITY',
                        organisationDetails: {
                            organisationName: 'Organisation Name',
                        },
                    },
                    {
                        partyRole: 'DEFENDANT',
                    },
                    {
                        partyRole: 'DEFENDANT_REPRESENTATIVE',
                    },
                ],
            };
            listParseHelperService.findAndManipulatePartyInformation(partyDetails);
            expect(partyDetails['appellant']).to.equal('Mr Forenames Middlename Surname');
            expect(partyDetails['appellantRepresentative']).to.equal('Mr Forenames Middlename Surname');
            expect(partyDetails['applicant']).to.equal('Mr Forenames Middlename Surname');
            expect(partyDetails['applicantRepresentative']).to.equal('Mr Forenames Middlename Surname');
            expect(partyDetails['respondent']).to.equal('Organisation Name');
            expect(partyDetails['respondentRepresentative']).to.equal('Organisation Name');
            expect(partyDetails['defendant']).to.equal('');
            expect(partyDetails['defendantRepresentative']).to.equal('');
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

    describe('createOrganisationDetails', () => {
        it('should create organisation details with organisation name', async () => {
            const organisationDetails = {
                organisationName: 'Organisation name',
            };
            expect(listParseHelperService.createOrganisationDetails(organisationDetails)).to.equal('Organisation name');
        });
    });

    describe('Find and manipulate judiciary', () => {
        it('should return presiding judiciary first before other judiciary', async () => {
            const judiciaryDetails = {
                judiciary: [
                    {
                        johKnownAs: 'Judge KnownAs',
                    },
                    {
                        johKnownAs: 'Judge KnownAs Presiding',
                        isPresiding: true,
                    },
                ],
            };
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryDetails)).to.equal(
                'Judge KnownAs Presiding, Judge KnownAs'
            );
        });
        it('should return presiding judiciary if there are no other judiciary', async () => {
            const judiciaryDetails = {
                judiciary: [
                    {
                        johKnownAs: 'Judge KnownAs Presiding',
                        isPresiding: true,
                    },
                ],
            };
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryDetails)).to.equal(
                'Judge KnownAs Presiding'
            );
        });
        it('should return list of judiciary if there are no presiding judiciary', async () => {
            const judiciaryDetails = {
                judiciary: [
                    {
                        johKnownAs: 'Judge KnownAs',
                    },
                    {
                        johKnownAs: 'Judge KnownAs 2',
                        isPresiding: false,
                    },
                    {
                        johKnownAs: 'Judge KnownAs 3',
                    },
                ],
            };
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryDetails)).to.equal(
                'Judge KnownAs, Judge KnownAs 2, Judge KnownAs 3'
            );
        });
        it('should return an empty string if there are no judiciary details', async () => {
            const judiciaryNoDetails = {
                judiciary: [],
            };
            const judiciaryNotPresent = {
                session: [
                    {
                        sittings: [],
                    },
                ],
            };
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryNoDetails)).to.equal('');
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryNotPresent)).to.equal('');
        });
        it('should display judiciary details correctly if a name is missing', async () => {
            const judiciaryDetails = {
                judiciary: [
                    {
                        johKnownAs: 'Judge KnownAs',
                    },
                    {
                        johKnownAs: '',
                        isPresiding: false,
                    },
                    {
                        johKnownAs: 'Judge KnownAs 3',
                    },
                ],
            };
            expect(listParseHelperService.findAndManipulateJudiciary(judiciaryDetails)).to.equal(
                'Judge KnownAs, Judge KnownAs 3'
            );
        });
    });

    describe('calculateDuration', () => {
        it('should calculate duration in hours and minutes', () => {
            const sitting = {
                sittingStart: '2022-02-13T14:30:00.000Z',
                sittingEnd: '2022-02-13T16:00:00.000Z',
            };
            listParseHelperService.calculateDuration(sitting);
            expect(sitting['durationAsHours']).to.equal(1);
            expect(sitting['durationAsMinutes']).to.equal(30);
            expect(sitting['durationAsDays']).to.equal(0);
            expect(sitting['time']).to.be.a('string');
        });

        it('should calculate duration in days if duration exceeds 24 hours', () => {
            const sitting = {
                sittingStart: '2022-02-13T14:30:00.000Z',
                sittingEnd: '2022-02-14T16:30:00.000Z',
            };
            listParseHelperService.calculateDuration(sitting);
            expect(sitting['durationAsHours']).to.equal(26);
            expect(sitting['durationAsMinutes']).to.equal(0);
            expect(sitting['durationAsDays']).to.equal(1);
        });

        it('should set duration fields to empty if start or end is empty', () => {
            const sitting = {
                sittingStart: '',
                sittingEnd: '',
            };
            listParseHelperService.calculateDuration(sitting);
            expect(sitting['duration']).to.equal('');
            expect(sitting).to.not.have.property('durationAsHours');
            expect(sitting).to.not.have.property('durationAsMinutes');
            expect(sitting).to.not.have.property('durationAsDays');
        });
    });

    describe('findAndConcatenateHearingPlatform', () => {
        it('should concatenate channels from sitting', () => {
            const sitting = {
                channel: ['Teams', 'In-Person'],
            };
            const session = {};
            listParseHelperService.findAndConcatenateHearingPlatform(sitting, session);
            expect(sitting['caseHearingChannel']).to.equal('Teams, In-Person');
        });

        it('should concatenate channels from session if sitting channel is empty', () => {
            const sitting = {
                channel: [],
            };
            const session = {
                sessionChannel: ['Channel', 'Telephone'],
            };
            listParseHelperService.findAndConcatenateHearingPlatform(sitting, session);
            expect(sitting['caseHearingChannel']).to.equal('Channel, Telephone');
        });

        it('should set caseHearingChannel to empty string if no channels present', () => {
            const sitting = {};
            const session = {};
            listParseHelperService.findAndConcatenateHearingPlatform(sitting, session);
            expect(sitting['caseHearingChannel']).to.equal('');
        });
    });

    describe('formatCaseTime', () => {
        it('should format time as hour only if minutes are zero', () => {
            const sitting = {
                sittingStart: '2022-02-13T14:00:00.000Z',
            };
            listParseHelperService.formatCaseTime(sitting, 'ha');
            expect(sitting['time']).to.equal('2pm');
        });

        it('should format time as hour and minute if minutes are not zero', () => {
            const sitting = {
                sittingStart: '2022-02-13T14:30:00.000Z',
            };
            listParseHelperService.formatCaseTime(sitting, 'h:mma');
            expect(sitting['time']).to.equal('2:30pm');
        });

        it('should handle non-UTC times correctly', () => {
            const sitting = {
                sittingStart: '2022-02-13T14:30:00.000',
            };
            listParseHelperService.formatCaseTime(sitting, 'h:mma');
            expect(sitting['time']).to.be.a('string');
        });

        it('should not set time if sittingStart is empty', () => {
            const sitting = {
                sittingStart: '',
            };
            listParseHelperService.formatCaseTime(sitting, 'h:mma');
            expect(sitting['time']).to.be.undefined;
        });
    });
});
