import { ListParseHelperService } from '../ListParseHelperService';
import { CrimeListsService } from './CrimeListsService';
import { formatDate } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();
const crimeListsService = new CrimeListsService();

export class MagistratesStandardListService {
    public manipulateData(jsonData: string): Array<object> {
        const listData = new Array<object>();

        JSON.parse(jsonData).courtLists.forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    const sittings = [];
                    session.sittings.forEach(sitting => {
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        sitting.hearing.forEach(hearing => {
                            hearing.case?.forEach(caseObject => {
                                if (caseObject.party) {
                                    const hearingInfo = this.buildHearingInfo(sitting, caseObject, hearing);
                                    caseObject.party?.forEach(party =>
                                        this.processParty(party, hearingInfo, sittings, party.partyRole === 'DEFENDANT')
                                    );
                                }
                            });

                            hearing.application?.forEach(application => {
                                if (application.party) {
                                    const hearingInfo = this.buildHearingInfo(sitting, application, hearing, true);
                                    application.party?.forEach(party =>
                                        this.processParty(party, hearingInfo, sittings, party.subject === true)
                                    );
                                }
                            });
                        });
                    });

                    const courtRoomObject = {
                        courtHouseName: ListParseHelperService.writeStringIfValid(courtList.courtHouse.courtHouseName),
                        courtRoomName: this.formatCourtRoomJudiciary(courtRoom, session),
                        lja: ListParseHelperService.writeStringIfValid(courtList.courtHouse.lja),
                    };

                    const existingKeyIndex = listData.findIndex(
                        room =>
                            room['courtRoomName'] === courtRoomObject['courtRoomName'] &&
                            room['courtHouseName'] === courtRoomObject['courtHouseName']
                    );

                    if (existingKeyIndex === -1) {
                        courtRoomObject['sittings'] = sittings;
                        listData.push(courtRoomObject);
                    } else {
                        listData[existingKeyIndex]['sittings'].concat(sittings);
                    }
                });
            });
        });

        return listData;
    }

    private formatDate(date) {
        return formatDate(ListParseHelperService.writeStringIfValid(date), 'dd/MM/yyyy', 'en');
    }

    private buildHearingInfo(sitting, matter, hearing, isApplication = false) {
        const prosecutingAuthority =
            matter.party?.find(party => party['partyRole'] === 'PROSECUTING_AUTHORITY' && party['organisationDetails'])
                ?.organisationDetails.organisationName || '';

        return {
            sittingStartTime: helperService.formatCaseTime(sitting),
            prosecutingAuthority,
            attendanceMethod: ListParseHelperService.writeStringIfValid(hearing.channel),
            reference: ListParseHelperService.writeStringIfValid(
                isApplication ? matter.applicationReference : matter.caseUrn
            ),
            applicationType: ListParseHelperService.writeStringIfValid(matter.applicationType),
            caseSequenceIndicator: ListParseHelperService.writeStringIfValid(matter.caseSequenceIndicator),
            hearingType: ListParseHelperService.writeStringIfValid(hearing.hearingType),
            panel: ListParseHelperService.writeStringIfValid(hearing.panel),
            applicationParticulars: ListParseHelperService.writeStringIfValid(matter.applicationParticulars),
            reportingRestriction: matter?.reportingRestriction ?? '',
            reportingRestrictionDetails: matter?.reportingRestrictionDetails
                ? ListParseHelperService.formatReportingRestrictionDetails(matter)
                : '',
        };
    }

    private buildSittingHeading(hearingInfo) {
        const caseSequenceIndicator = hearingInfo.caseSequenceIndicator;

        if (hearingInfo.sittingStartTime) {
            return caseSequenceIndicator
                ? hearingInfo.sittingStartTime + ' [' + caseSequenceIndicator + ']'
                : hearingInfo.sittingStartTime;
        }
        return '';
    }

    private processParty(party, hearingInfo, sittings: any[], isMainParty: boolean) {
        if (isMainParty) {
            const sittingHeading = this.buildSittingHeading(hearingInfo);
            if (party.organisationDetails) {
                const hearing = {
                    ...hearingInfo,
                    partyInfo: this.buildOrganisationPartyInfo(party.organisationDetails),
                    offences: this.processOffences(party),
                };
                this.addSitting(sittings, sittingHeading, hearing);
            } else if (party.individualDetails) {
                const hearing = {
                    ...hearingInfo,
                    partyInfo: this.buildIndividualPartyInfo(party.individualDetails),
                    offences: this.processOffences(party),
                };
                this.addSitting(sittings, sittingHeading, hearing);
            }
        }
    }

    private buildIndividualPartyInfo(individualDetails) {
        return {
            name: this.formatIndividualPartyName(individualDetails),
            dob: this.formatDate(individualDetails.dateOfBirth),
            age: ListParseHelperService.writeStringIfValid(individualDetails.age),
            address: crimeListsService.formatAddress(individualDetails.address, ', '),
            asn: ListParseHelperService.writeStringIfValid(individualDetails.asn),
        };
    }

    private buildOrganisationPartyInfo(organisationDetails) {
        return {
            name: ListParseHelperService.writeStringIfValid(organisationDetails.organisationName),
            address: crimeListsService.formatAddress(organisationDetails.organisationAddress, ', '),
        };
    }

    private formatIndividualPartyName(individualDetails) {
        const gender = ListParseHelperService.writeStringIfValid(individualDetails.gender);
        return (
            crimeListsService.createIndividualDetails(individualDetails) +
            (gender.length > 0 ? ` (${gender})` : '') +
            (individualDetails.inCustody ? '*' : '')
        );
    }

    private processOffences(party) {
        const offences = [];
        party.offence?.forEach(offence => {
            offences.push({
                offenceCode: ListParseHelperService.writeStringIfValid(offence.offenceCode),
                offenceTitle: ListParseHelperService.writeStringIfValid(offence.offenceTitle),
                offenceWording: ListParseHelperService.writeStringIfValid(offence.offenceWording),
                plea: ListParseHelperService.writeStringIfValid(offence.plea),
                pleaDate: this.formatDate(offence.pleaDate),
                convictionDate: this.formatDate(offence.convictionDate),
                adjournedDate: this.formatDate(offence.adjournedDate),
                offenceLegislation: ListParseHelperService.writeStringIfValid(offence.offenceLegislation),
                offenceMaxPenalty: ListParseHelperService.writeStringIfValid(offence.offenceMaxPen),
                reportingRestriction: offence.reportingRestriction ?? '',
                reportingRestrictionDetails: offence.reportingRestrictionDetails
                    ? ListParseHelperService.formatReportingRestrictionDetails(offence)
                    : '',
            });
        });
        return offences;
    }

    private addSitting(sittings, sittingHeading, hearing) {
        // Check if a matter with the same party heading has already been stored. If so append the new matter to it,
        // or else add it to the existing list
        const commonSitting = sittings.find(sitting => sitting.sittingHeading === sittingHeading);

        if (commonSitting) {
            commonSitting.hearings.push(hearing);
        } else {
            sittings.push({ sittingHeading, hearings: [hearing] });
        }
    }

    /**
     * Processes the judiciary for the court room
     * @param courtRoom The court room to be processed
     * @param session The session containing the court room
     * @private
     */
    private formatCourtRoomJudiciary(courtRoom, session) {
        const judiciary = helperService.findAndManipulateJudiciary(session);
        const courtRoomName = ListParseHelperService.writeStringIfValid(courtRoom.courtRoomName);
        return [courtRoomName, judiciary].filter(item => item.length > 0).join(': ');
    }
}
