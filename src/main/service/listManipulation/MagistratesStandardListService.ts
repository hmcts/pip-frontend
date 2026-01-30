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
                    const matters = [];
                    session.sittings.forEach(sitting => {
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        sitting.hearing.forEach(hearing => {
                            hearing.case?.forEach(caseObject => {
                                if (caseObject.party) {
                                    const caseSitting = this.buildSitting(sitting, caseObject, hearing);
                                    caseObject.party?.forEach(party => this.processParty(party, caseSitting, matters));
                                }
                            });

                            hearing.application?.forEach(application => {
                                if (application.party) {
                                    const applicationSitting = this.buildSitting(sitting, application, hearing, true);
                                    application.party?.forEach(party =>
                                        this.processParty(party, applicationSitting, matters)
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
                        courtRoomObject['matters'] = matters;
                        listData.push(courtRoomObject);
                    } else {
                        listData[existingKeyIndex]['matters'].concat(matters);
                    }
                });
            });
        });

        return listData;
    }

    private formatDate(date) {
        return formatDate(ListParseHelperService.writeStringIfValid(date), 'dd/MM/yyyy', 'en');
    }

    private buildSitting(sitting, matter, hearing, isApplication = false) {
        const prosecutingAuthority =
            matter.party?.find(party => party['partyRole'] === 'PROSECUTING_AUTHORITY' && party['organisationDetails'])
                ?.organisationDetails.organisationName || '';

        return {
            sittingStartTime: helperService.formatCaseTime(sitting),
            info: {
                prosecutingAuthority,
                attendanceMethod: ListParseHelperService.writeStringIfValid(hearing.channel),
                reference: ListParseHelperService.writeStringIfValid(
                    isApplication ? matter.applicationReference : matter.caseUrn
                ),
                applicationType: ListParseHelperService.writeStringIfValid(matter.applicationType),
                caseSequenceIndicator: ListParseHelperService.writeStringIfValid(matter.caseSequenceIndicator),
                hearingType: ListParseHelperService.writeStringIfValid(hearing.hearingType),
                panel: ListParseHelperService.writeStringIfValid(hearing.panel),
            },
        };
    }

    private processParty(party, sitting, matters: any[]) {
        if (party.subject === true) {
            if (party.individualDetails) {
                const partyHeading = this.formatIndividualPartyHeading(party.individualDetails);
                sitting = {
                    ...sitting,
                    partyInfo: this.buildIndividualPartyInfo(party.individualDetails),
                    offences: this.processOffences(party),
                };
                this.addPartyMatter(matters, partyHeading, sitting);
            } else if (party.organisationDetails) {
                const partyHeading = ListParseHelperService.writeStringIfValid(
                    party.organisationDetails.organisationName
                );
                sitting = {
                    ...sitting,
                    partyInfo: this.buildOrganisationPartyInfo(party.organisationDetails),
                    offences: this.processOffences(party),
                };
                this.addPartyMatter(matters, partyHeading, sitting);
            }
        }
    }

    private buildIndividualPartyInfo(individualDetails) {
        return {
            dob: ListParseHelperService.writeStringIfValid(individualDetails.dateOfBirth),
            age: ListParseHelperService.writeStringIfValid(individualDetails.age),
            address: crimeListsService.formatAddress(individualDetails.address, ', '),
            asn: ListParseHelperService.writeStringIfValid(individualDetails.asn),
        };
    }

    private buildOrganisationPartyInfo(organisationDetails) {
        return {
            address: crimeListsService.formatAddress(organisationDetails.organisationAddress, ', '),
        };
    }

    private formatIndividualPartyHeading(individualDetails) {
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
            });
        });
        return offences;
    }

    private addPartyMatter(matters: any[], partyHeading, sitting) {
        // Check if a matter with the same party heading has already been stored. If so append the new matter to it,
        // or else add it to the existing list
        const commonParty = matters.find(matter => matter.partyHeading === partyHeading);

        if (commonParty) {
            commonParty.sittings.push(sitting);
        } else {
            matters.push({ partyHeading, sittings: [sitting] });
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
