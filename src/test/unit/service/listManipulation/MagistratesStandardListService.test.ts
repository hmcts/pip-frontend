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
            expect(data[0]).to.have.property('sittings').that.is.an('array').with.length.greaterThan(0);
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
        it('should format individual subject sitting heading with case sequence indicator', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const expectedHeading = '1:30pm [2 of 3]';
            const found = data.flatMap(room => room.sittings).find((c: any) => c.sittingHeading === expectedHeading);

            expect(found, 'Expected heading not found in sitting heading').to.exist;
        });

        it('should process offences correctly', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const offences = data[0].sittings[0].hearings[0].offences;
            expect(offences).to.be.an('array').with.lengthOf(2);

            expect(offences[0]).to.deep.equal({
                offenceCode: 'dd01-01',
                offenceTitle: 'drink driving',
                offenceWording: 'driving whilst under the influence of alcohol',
                plea: 'NOT_GUILTY',
                pleaDate: '27/06/2026',
                convictionDate: '01/05/2026',
                adjournedDate: '02/05/2026',
                offenceLegislation: 'This is a legislation',
                offenceMaxPenalty: '100yrs',
                reportingRestriction: true,
                reportingRestrictionDetails: 'This is an offence level reporting restriction details example',
            });
        });

        it('should correctly build individual subject party info', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const partyInfo = data[0].sittings[0].hearings[0].partyInfo;
            expect(partyInfo).to.deep.equal({
                name: 'Surname A, Forename A MiddleName A (male)',
                dob: '01/01/1950',
                age: 20,
                address: 'Address Line 1A, Address Line 2A, Town A, County A, AA1 AA1',
                asn: 'ABC1234',
            });
        });

        it('should correctly build organisation subject party info', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const partyInfo = data[1].sittings[1].hearings[2].partyInfo;
            expect(partyInfo).to.deep.equal({
                name: 'This is an organisation',
                address: 'Address Line 1E, Address Line 2E, Town E, This is a postcode',

            });
        });

        it('should return expected hearing metadata for case', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const hearingInfo = data[0].sittings[0].hearings[0];
            expect(hearingInfo).to.contain({
                sittingStartTime: '1:30pm',
                prosecutingAuthority: 'Prosecuting Authority Name',
                reference: '45684548',
                applicationType: '',
                caseSequenceIndicator: '2 of 3',
                hearingType: 'Hearing Type A',
                panel: 'ADULT',
                applicationParticulars: '',
                reportingRestriction: true,
                reportingRestrictionDetails: 'This is a case level reporting restriction details example',
            });
            expect(hearingInfo.attendanceMethod).to.have.length(1);
            expect(hearingInfo.attendanceMethod[0]).to.equal('VIDEO HEARING A');
        });

        it('should return expected hearing metadata for application', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const hearingInfo = data[1].sittings[1].hearings[2];
            expect(hearingInfo).to. contain({
                prosecutingAuthority: 'Prosecuting Authority Name',
                reference: 'AppRefB',
                applicationType: 'Application Type 2',
                caseSequenceIndicator: '',
                hearingType: 'Hearing Type B',
                panel: 'ADULT',
                applicationParticulars: '',
                reportingRestriction: '',
                reportingRestrictionDetails: '',
            });
            expect(hearingInfo.attendanceMethod).to.have.length(1);
            expect(hearingInfo.attendanceMethod[0]).to.equal('VIDEO HEARING');
        });

        it('should add multiple hearings for the same sitting', () => {
            const data = magistratesStandardListService.manipulateData(rawMagistrateStandardListData) as any[];
            const hearing = data[1].sittings[1].hearings;
            expect(hearing.length).to.equal(3);
        });
    });

    describe('Edge cases and error handling', () => {
        it('should handle parties with no offences', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[1].offence = [];
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            const offences = data[0].sittings[0].hearings[0].offences;
            expect(offences).to.be.an('array').that.is.empty;
        });

        it('should handle missing individualDetails and organisationDetails', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party[1] = {};
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            expect(data[0].sittings).to.have.length(1);
        });

        it('should handle missing party array', () => {
            const json = JSON.parse(rawMagistrateStandardListData);
            delete json.courtLists[0].courtHouse.courtRoom[0].session[0].sittings[0].hearing[0].case[0].party;
            const data = magistratesStandardListService.manipulateData(JSON.stringify(json)) as any[];
            expect(data[0].sittings).to.have.length(1);
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
