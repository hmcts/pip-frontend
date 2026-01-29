import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { MagistratesStandardListService } from '../../../../main/service/listManipulation/MagistratesStandardListService';
import { ListParseHelperService } from '../../../../main/service/ListParseHelperService';
import { CrimeListsService } from '../../../../main/service/listManipulation/CrimeListsService';

const magistratesStandardListService = new MagistratesStandardListService();
const rawMagistrateStandardListData = fs.readFileSync(
    path.resolve(__dirname, '../../mocks/magistratesStandardList.json'),
    'utf-8'
);

describe('Magistrate Standard List service', () => {
    describe('manipulateData', () => {
        it('should return an array of court rooms with cases and applications', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            expect(data).to.be.an('array');
            expect(data.length).to.be.greaterThan(0);

            expect(data[0]['courtHouseName']).to.equal('PRESTON');
            expect(data[0]['courtRoomName']).to.include('Courtroom 1');
            expect(data[0]['lja']).to.equal('Local Justice Area A');
            expect(data[0]).to.have.property('casesAndApplications').that.is.an('array').with.length.greaterThan(0);
        });

        it('should handle empty courtLists gracefully', () => {
            const emptyData = JSON.stringify({ courtLists: [] });
            const data = magistratesStandardListService.manipulateData(emptyData);
            expect(data).to.be.an('array').that.is.empty;
        });

        it('should handle missing courtRoom/session/sittings gracefully', () => {
            const minimalData = JSON.stringify({
                courtLists: [{ courtHouse: { courtRoom: [] } }],
            });
            const data = magistratesStandardListService.manipulateData(minimalData);
            expect(data).to.be.an('array').that.is.empty;
        });

        it('should not throw if hearing.case or hearing.application is missing', () => {
            const customData = JSON.stringify({
                courtLists: [
                    {
                        courtHouse: {
                            courtRoom: [
                                {
                                    courtRoomName: 'Room',
                                    session: [
                                        {
                                            sittings: [
                                                {
                                                    hearing: [{}],
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    },
                ],
            });
            expect(() => magistratesStandardListService.manipulateData(customData)).to.not.throw();
        });
    });

    describe('Private methods (indirectly via manipulateData)', () => {
        it('should format individual subject party heading with gender and custody', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const expectedHeading = 'Surname1, Forename1 (male)*';
            const found = data
                .flatMap(room => room['casesAndApplications'])
                .find((c: any) => c.partyHeading === expectedHeading);

            expect(found, 'Expected heading not found in partyHeading').to.exist;
        });

        it('should format organisation subject party heading', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const found = data
                .flatMap(room => room['casesAndApplications'])
                .find((c: any) => c.partyHeading === 'This is an organisation');
            expect(found).to.exist;
        });

        it('should process offences correctly', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const offences = data[0]['casesAndApplications'][0].sittings[0].offences;
            expect(offences).to.be.an('array').with.lengthOf(2);

            expect(offences[0]).to.deep.equal({
                offenceCode: 'dd01-01',
                offenceTitle: 'drink driving',
                offenceWording: 'driving whilst under the influence of alcohol',
                plea: 'NOT_GUILTY',
                pleaDate: '27/01/2026',
                convictionDate: '01/05/2026',
                adjournedDate: '02/05/2026',
                offenceLegislation: 'This is a legislation',
                offenceMaxPenalty: '100yrs',
            });
        });

        it('should correctly build individual subject party info', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const partyInfo = data[0]['casesAndApplications'][0].sittings[0].partyInfo;
            expect(partyInfo).to.deep.equal({
                dob: '01/01/1950',
                age: 20,
                address: 'Address Line 1, Address Line 2, Town A, County A, AA1 AA1',
                asn: 'AB12345',
            });
        });

        it('should correctly build organisation subject party info', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const orgCase = data
                .flatMap(room => room['casesAndApplications'])
                .find((c: any) => c.partyHeading === 'This is an organisation');
            expect(orgCase).to.exist;
            const orgPartyInfo = orgCase.sittings[0].partyInfo;
            expect(orgPartyInfo).to.deep.equal({
                address: 'Address Line 1Z, Address Line 2Z, Town C, This is a postcode',
            });
        });

        it('should cover buildHearing output for case', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const sittingInfo = data[0]['casesAndApplications'][0].sittings[0].info;
            expect(sittingInfo).to.deep.equal({
                prosecutingAuthority: 'Prosecuting Authority Name',
                attendanceMethod: ['VIDEO HEARING'],
                reference: '45684548',
                applicationType: '',
                caseSequenceIndicator: '2 of 3',
                hearingType: 'mda',
                panel: 'ADULT',
            });
        });

        it('should cover buildHearing output for application', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const appSittingInfo = data[1]['casesAndApplications']
                .flatMap((ca: any) => ca.sittings)
                .find((sit: any) => sit.info.reference === 'AppRefB').info;
            expect(appSittingInfo).to.deep.equal({
                prosecutingAuthority: 'Prosecuting Authority Name',
                attendanceMethod: ['VIDEO HEARING'],
                reference: 'AppRefB',
                applicationType: 'Application Type 2',
                caseSequenceIndicator: '',
                hearingType: 'mda',
                panel: 'ADULT',
            });
        });

        it('should add multiple sittings for the same subject party', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            const sitting = JSON.parse(
                JSON.stringify(json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0])
            );
            json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings.push(sitting);
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            const subjectCases = data[0]['casesAndApplications'].filter((c: any) => c.partyHeading);
            subjectCases.forEach((c: any) => {
                expect(c.sittings.length).to.be.greaterThan(0);
            });
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle parties with no offences', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[0].offence = [];
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            const offences = data[0]['casesAndApplications'][0].sittings[0].offences;
            expect(offences).to.be.an('array').that.is.empty;
        });

        it('should handle missing individualDetails and organisationDetails', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[0] = {
                subject: true,
            };
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            expect(data[0]['casesAndApplications']).to.have.length(0);
        });

        it('should handle missing party array', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            delete json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party;
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            expect(data[0]['casesAndApplications']).to.have.length(0);
        });
    });

    describe('Helper/utility coverage', () => {
        it('should call helperService.findAndConcatenateHearingPlatform', () => {
            const spy = sinon.spy(ListParseHelperService.prototype, 'findAndConcatenateHearingPlatform');
            magistratesStandardListService.manipulateData(rawMagistrateStandardListData);
            expect(spy.called).to.be.true;
            spy.restore();
        });

        it('should call helperService.findAndManipulateJudiciary', () => {
            const spy = sinon.spy(ListParseHelperService.prototype, 'findAndManipulateJudiciary');
            magistratesStandardListService.manipulateData(rawMagistrateStandardListData);
            expect(spy.called).to.be.true;
            spy.restore();
        });

        it('should call crimeListsService.formatAddress', () => {
            const spy = sinon.spy(CrimeListsService.prototype, 'formatAddress');
            magistratesStandardListService.manipulateData(rawMagistrateStandardListData);
            expect(spy.called).to.be.true;
            spy.restore();
        });

        it('should call crimeListsService.createIndividualDetails', () => {
            const spy = sinon.spy(CrimeListsService.prototype, 'createIndividualDetails');
            magistratesStandardListService.manipulateData(rawMagistrateStandardListData);
            expect(spy.called).to.be.true;
            spy.restore();
        });
    });
});
