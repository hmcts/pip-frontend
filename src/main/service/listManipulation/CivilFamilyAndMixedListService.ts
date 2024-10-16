import { ListParseHelperService } from '../ListParseHelperService';

const helperService = new ListParseHelperService();

export class CivilFamilyAndMixedListService {
    /**
     * Manipulate the civil/family/mixed json data for rendering to the screen.
     * @param list
     */
    public sculptedListData(list: string, isFamilyMixedList = false): object {
        const outputData = JSON.parse(list);
        outputData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciaries'] = helperService.findAndManipulateJudiciary(session);
                    session['sittings'].forEach(sitting => {
                        helperService.calculateDuration(sitting);
                        helperService.findAndConcatenateHearingPlatform(sitting, session);
                        if (isFamilyMixedList) {
                            sitting['hearing'].forEach(hearing => {
                                hearing['case'].forEach(hearingCase => {
                                    this.handleFamilyMixedListParties(hearingCase);
                                    hearingCase['formattedReportingRestriction'] =
                                        ListParseHelperService.formatReportingRestrictionDetail(hearingCase);
                                });
                            });
                        }
                    });
                });
            });
        });

        return outputData;
    }

    private handleFamilyMixedListParties(node: any): void {
        let applicant = '';
        let respondent = '';
        let respondentRepresentative = '';
        let applicantRepresentative = '';
        node.party?.forEach(party => {
            switch (ListParseHelperService.convertPartyRole(party.partyRole)) {
                case 'APPLICANT_PETITIONER': {
                    applicant += this.createPartyDetails(party).trim();
                    applicant += helperService.stringDelimiter(applicant.length, ',');
                    break;
                }
                case 'APPLICANT_PETITIONER_REPRESENTATIVE': {
                    applicantRepresentative += this.createPartyDetails(party).trim();
                    applicantRepresentative += helperService.stringDelimiter(applicantRepresentative.length, ',');
                    break;
                }
                case 'RESPONDENT': {
                    respondent += this.createPartyDetails(party).trim();
                    respondent += helperService.stringDelimiter(respondent.length, ',');
                    break;
                }
                case 'RESPONDENT_REPRESENTATIVE': {
                    respondentRepresentative += this.createPartyDetails(party).trim();
                    respondentRepresentative += helperService.stringDelimiter(respondentRepresentative.length, ',');
                    break;
                }
            }
        });

        node['applicant'] = applicant.replace(/,\s*$/, '').trim();
        node['applicantRepresentative'] = applicantRepresentative.replace(/,\s*$/, '').trim();
        node['respondent'] = respondent.replace(/,\s*$/, '').trim();
        node['respondentRepresentative'] = respondentRepresentative.replace(/,\s*$/, '').trim();
    }

    private createPartyDetails(party: any): string {
        if (party.individualDetails) {
            return helperService.createIndividualDetails(party.individualDetails, false);
        } else if (party.organisationDetails) {
            return ListParseHelperService.writeStringIfValid(party.organisationDetails?.organisationName);
        }
        return '';
    }
}
