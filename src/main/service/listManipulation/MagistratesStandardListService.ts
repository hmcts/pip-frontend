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
                    const casesAndApplications = [];
                    session.sittings.forEach(sitting => {
                        this.processSittingInfo(session, sitting);
                        sitting.hearing.forEach(hearing => {
                            hearing.case?.forEach(caseObject => {
                                if (caseObject.party) {
                                    const caseInfo = this.buildMatterInfo(caseObject, hearing);
                                    const caseSitting = this.buildSitting(sitting, caseInfo);
                                    caseObject.party?.forEach(party =>
                                        this.processParty(party, caseSitting, casesAndApplications)
                                    );
                                }
                            });

                            hearing.application?.forEach(application => {
                                if (application.party) {
                                    const applicationInfo = this.buildMatterInfo(application, hearing, true);
                                    const applicationSitting = this.buildSitting(sitting, applicationInfo);
                                    application.party?.forEach(party =>
                                        this.processParty(party, applicationSitting, casesAndApplications)
                                    );
                                }
                            });
                        });

                        const courtRoomObject = {
                            courtHouseName: ListParseHelperService.writeStringIfValid(
                                courtList.courtHouse.courtHouseName
                            ),
                            courtRoomName: this.formatCourtRoomJudiciary(courtRoom, session),
                            lja: ListParseHelperService.writeStringIfValid(courtList.courtHouse.lja),
                        };

                        const existingKeyIndex = listData.findIndex(
                            room =>
                                room['courtRoomName'] === courtRoomObject['courtRoomName'] &&
                                room['courtHouseName'] === courtRoomObject['courtHouseName']
                        );

                        if (existingKeyIndex === -1) {
                            courtRoomObject['casesAndApplications'] = casesAndApplications;
                            listData.push(courtRoomObject);
                        } else {
                            listData[existingKeyIndex]['casesAndApplications'] =
                                listData[existingKeyIndex]['casesAndApplications'].concat(casesAndApplications);
                        }
                    });
                });
            });
        });

        return listData;
    }

    private processSittingInfo(session, sitting) {
        helperService.findAndConcatenateHearingPlatform(sitting, session);
    }

    private buildMatterInfo(applicationOrCase, hearing, isApplication = false) {
        const prosecutingAuthority =
            applicationOrCase.party?.find(
                party => party['partyRole'] === 'PROSECUTING_AUTHORITY' && party['organisationDetails']
            )?.organisationDetails.organisationName || '';

        return {
            prosecutingAuthority,
            attendanceMethod: ListParseHelperService.writeStringIfValid(hearing.channel),
            reference: ListParseHelperService.writeStringIfValid(
                isApplication ? applicationOrCase.applicationReference : applicationOrCase.caseUrn
            ),
            applicationType: ListParseHelperService.writeStringIfValid(applicationOrCase.applicationType),
            caseSequenceIndicator: ListParseHelperService.writeStringIfValid(applicationOrCase.caseSequenceIndicator),
            hearingType: ListParseHelperService.writeStringIfValid(hearing.hearingType),
            panel: ListParseHelperService.writeStringIfValid(hearing.panel),
        };
    }

    private formatDate(date) {
        return formatDate(ListParseHelperService.writeStringIfValid(date), 'dd/MM/yyyy', 'en');
    }

    private buildSitting(sitting, caseApplicationInfo) {
        return {
            sittingStartTime: helperService.formatCaseTime(sitting),
            info: caseApplicationInfo,
        };
    }

    private processParty(party, sitting, casesAndApplications) {
        if (party.subject === true) {
            if (party.individualDetails) {
                const partyHeading = this.formatIndividualPartyHeading(party.individualDetails);
                sitting = {
                    ...sitting,
                    partyInfo: this.buildIndividualPartyInfo(party),
                    offences: this.processOffences(party),
                };
                this.addPartyMatter(casesAndApplications, partyHeading, sitting);
            } else if (party.organisationDetails) {
                const partyHeading = this.formatOrganisationPartyHeading(party.organisationDetails);
                sitting = {
                    ...sitting,
                    partyInfo: this.buildOrganisationPartyInfo(party),
                    offences: this.processOffences(party),
                };
                this.addPartyMatter(casesAndApplications, partyHeading, sitting);
            }
        }
    }

    private buildIndividualPartyInfo(party) {
        return {
            dob: ListParseHelperService.writeStringIfValid(party.individualDetails.dateOfBirth),
            age: ListParseHelperService.writeStringIfValid(party.individualDetails.age),
            address: crimeListsService.formatAddress(party.individualDetails.address, ', '),
            asn: ListParseHelperService.writeStringIfValid(party.individualDetails.asn),
        };
    }

    private buildOrganisationPartyInfo(party) {
        return {
            address: crimeListsService.formatAddress(party.organisationDetails.organisationAddress, ', '),
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

    private formatOrganisationPartyHeading(organisationDetails) {
        return ListParseHelperService.writeStringIfValid(organisationDetails.organisationName);
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

    private addPartyMatter(matters, partyHeading, caseAndApplicationSitting) {
        // Check if a matter with the same party heading has already been stored. If so append the new matter to it,
        // or else add it to the existing list
        const commonParty = this.fetchCommonPartyMatter(matters, partyHeading);

        if (commonParty) {
            commonParty.sittings.push(caseAndApplicationSitting);
        } else {
            const sittings = [caseAndApplicationSitting];
            matters.push({ partyHeading, sittings });
        }
    }

    private fetchCommonPartyMatter(matters, partyHeading) {
        for (const m of matters) {
            if (m.partyHeading === partyHeading) {
                return m;
            }
        }
        return null;
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
