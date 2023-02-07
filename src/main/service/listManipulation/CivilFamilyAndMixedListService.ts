import { ListParseHelperService } from '../listParseHelperService';

const helperService = new ListParseHelperService();

export class civilFamilyAndMixedListService {
    /**
     * Manipulate the civil json data for rendering to the screen.
     * @param list
     */
    public sculptedCivilListData(list: string): object {
        return this.sculptedListData(list);
    }

    /**
     * Manipulate the family/mixed json data for rendering to the screen.
     * @param list
     */
    public sculptedFamilyMixedListData(list: string): object {
        return this.sculptedListData(list, true);
    }

    private sculptedListData(list: string, isFamilyMixedList = false): object {
        const outputData = JSON.parse(list);
        outputData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciaries'] = helperService.findAndManipulateJudiciary(session);
                    session['sittings'].forEach(sitting => {
                        helperService.calculateDuration(sitting);
                        helperService.findAndConcatenateHearingPlatform(sitting, session);

                        sitting['hearing'].forEach(hearing => {
                            isFamilyMixedList
                                ? this.handleFamilyMixedListParties(hearing)
                                : helperService.findAndManipulatePartyInformation(hearing);
                        });
                    });
                });
            });
        });

        return outputData;
    }

    private handleFamilyMixedListParties(hearing: any): void {
        let applicant = '';
        let respondent = '';
        let respondentRepresentative = '';
        let applicantRepresentative = '';
        if (hearing?.party) {
            hearing.party.forEach(party => {
                switch (ListParseHelperService.convertPartyRole(party.partyRole)) {
                    case 'APPLICANT_PETITIONER': {
                        applicant += this.createPartyDetails(party).trim();
                        applicant += helperService.stringDelimiter(applicant?.length, ',');
                        break;
                    }
                    case 'APPLICANT_PETITIONER_REPRESENTATIVE': {
                        const applicantPetitionerDetails = this.createPartyDetails(party).trim();
                        if (applicantPetitionerDetails) {
                            applicantRepresentative += 'LEGALADVISOR: ' + applicantPetitionerDetails + ', ';
                        }
                        break;
                    }
                    case 'RESPONDENT': {
                        respondent += this.createPartyDetails(party).trim();
                        respondent += helperService.stringDelimiter(respondent?.length, ',');
                        break;
                    }
                    case 'RESPONDENT_REPRESENTATIVE': {
                        const respondentDetails = this.createPartyDetails(party).trim();
                        if (respondentDetails) {
                            respondentRepresentative += 'LEGALADVISOR: ' + respondentDetails + ', ';
                        }
                        break;
                    }
                }
            });

            applicant += applicantRepresentative;
            respondent += respondentRepresentative;
            hearing['applicant'] = applicant?.replace(/,\s*$/, '').trim();
            hearing['respondent'] = respondent?.replace(/,\s*$/, '').trim();
        }
    }

    private createPartyDetails(party: any): string {
        if (party.individualDetails !== undefined) {
            return helperService.createIndividualDetails(party.individualDetails, false);
        } else if (party.organisationDetails !== undefined) {
            return ListParseHelperService.writeStringIfValid(party.organisationDetails?.organisationName);
        }
        return '';
    }
}
