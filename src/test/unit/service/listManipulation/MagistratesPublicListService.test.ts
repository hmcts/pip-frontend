import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { MagistratesPublicListService } from '../../../../main/service/listManipulation/MagistratesPublicListService';

const magistratesPublicListService = new MagistratesPublicListService();
const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesPublicList.json'), 'utf-8');

describe('Magistrates Public List service', () => {
    describe('manipulate data', () => {
        it('should find and format judiciary', async () => {
            const listData = magistratesPublicListService.manipulateData(rawData);
            listData['courtLists'].forEach(courtList => {
                courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                    courtRoom['session'].forEach(session => {
                        expect(session).to.have.property('formattedJudiciaries');
                    });
                });
            });

            const session1 = listData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0];
            expect(session1['formattedJudiciaries']).to.equal('Judge KnownAs, Judge KnownAs 2');
        });

        it('should format start time for each sitting', function () {
            const listData = magistratesPublicListService.manipulateData(rawData);
            listData['courtLists'].forEach(courtList => {
                courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                    courtRoom['session'].forEach(session => {
                        session['sittings'].forEach(sitting => {
                            expect(sitting).to.have.property('time');
                        });
                    });
                });
            });

            const sitting1 = listData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0];
            expect(sitting1['time']).to.equal('10:40am');
        });

        it('should find and format main defendant for each case or application', function () {
            const listData = magistratesPublicListService.manipulateData(rawData);
            listData['courtLists'].forEach(courtList => {
                courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                    courtRoom['session'].forEach(session => {
                        session['sittings'].forEach(sitting => {
                            sitting['hearing'].forEach(hearing => {
                                hearing['case']?.forEach(hearingCase => {
                                    expect(hearingCase).to.have.property('defendant');
                                });
                                hearing['application']?.forEach(hearingApplication => {
                                    expect(hearingApplication).to.have.property('defendant');
                                });
                            });
                        });
                    });
                });
            });

            const hearing1 =
                listData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0];
            expect(hearing1['case'][0]['defendant']).to.equal('Surname 1, Forename 1');
            expect(hearing1['application'][0]['defendant']).to.equal('Test Applicant Surname, Test Applicant Forename');
        });

        it('should find and format prosecuting authority for each case or application', function () {
            const listData = magistratesPublicListService.manipulateData(rawData);
            listData['courtLists'].forEach(courtList => {
                courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                    courtRoom['session'].forEach(session => {
                        session['sittings'].forEach(sitting => {
                            sitting['hearing'].forEach(hearing => {
                                hearing['case']?.forEach(hearingCase => {
                                    expect(hearingCase).to.have.property('prosecutingAuthority');
                                });
                                hearing['application']?.forEach(hearingApplication => {
                                    expect(hearingApplication).to.have.property('prosecutingAuthority');
                                });
                            });
                        });
                    });
                });
            });

            const hearing1 =
                listData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0];
            expect(hearing1['case'][0]['prosecutingAuthority']).to.equal('Pro_Auth');
            expect(hearing1['application'][0]['prosecutingAuthority']).to.equal('Test Surname, Test Forename');
        });

        it('should find and format offences', function () {
            const listData = magistratesPublicListService.manipulateData(rawData);
            listData['courtLists'].forEach(courtList => {
                courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                    courtRoom['session'].forEach(session => {
                        session['sittings'].forEach(sitting => {
                            sitting['hearing'].forEach(hearing => {
                                hearing['case']?.forEach(hearingCase => {
                                    expect(hearingCase).to.have.property('offences');
                                });
                                hearing['application']?.forEach(hearingApplication => {
                                    expect(hearingApplication).to.have.property('offences');
                                });
                            });
                        });
                    });
                });
            });

            const hearing1 =
                listData['courtLists'][0]['courtHouse']['courtRoom'][0]['session'][0]['sittings'][0]['hearing'][0];
            expect(hearing1['case'][0]['offences']).to.deep.equal(['Test offence 1']);
            expect(hearing1['case'][1]['offences']).to.deep.equal([
                'Test offence 1',
                'Test offence 2',
                'Test offence 3',
            ]);
            expect(hearing1['application'][0]['offences']).to.deep.equal([
                'Test offence 1',
                'Test offence 2',
                'Test offence 3',
            ]);
        });
    });
});
