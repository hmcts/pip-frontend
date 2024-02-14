import { ListParseHelperService } from '../listParseHelperService';
import { CrimeListsService } from './CrimeListsService';

const helperService = new ListParseHelperService();
const crimeListHelperService = new CrimeListsService();
const separator = ', ';
export class MagistratesPublicListService {
    public manipulateListData(magistratesPublicList: string, language: string, languageFile: string): object {
        const magistratesPublicListData = JSON.parse(magistratesPublicList);
        magistratesPublicListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['formattedJudiciaries'] = helperService.findAndManipulateJudiciary(session);
                    session['sittings'].forEach(sitting => {
                        crimeListHelperService.calculateDuration(sitting, language, languageFile);
                        sitting['hearing'].forEach(hearing => {
                            hearing['case'].forEach(hearingCase => {
                                this.manipulateParty(hearingCase);
                            });
                            crimeListHelperService.findLinkedCasesInformation(hearing);
                        });
                    });
                });
            });
        });
        return magistratesPublicListData;
    }

    private pushIfExists(array, item) {
        if (item.length > 0) {
            array.push(item);
        }
    }

    public manipulateParty(hearingCase: any): void {
        const defendants = [];
        const defendantRepresentatives = [];
        const prosecutingAuthorities = [];

        hearingCase?.party?.forEach(party => {
            switch (party.partyRole) {
                case 'DEFENDANT': {
                    this.pushIfExists(defendants, this.createIndividualDetails(party.individualDetails));
                    break;
                }
                case 'DEFENDANT_REPRESENTATIVE': {
                    this.pushIfExists(
                        defendantRepresentatives,
                        this.createOrganisationDetails(party.organisationDetails)
                    );
                    break;
                }
                case 'PROSECUTING_AUTHORITY': {
                    this.pushIfExists(
                        prosecutingAuthorities,
                        this.createOrganisationDetails(party.organisationDetails)
                    );
                    break;
                }
            }
        });
        hearingCase.defendant = defendants.join(separator);
        hearingCase.defendantRepresentative = defendantRepresentatives.join(separator);
        hearingCase.prosecutingAuthority = prosecutingAuthorities.join(separator);
    }

    public createIndividualDetails(individualDetails: any): string {
        const forenames = ListParseHelperService.writeStringIfValid(individualDetails?.individualForenames);
        const surname = ListParseHelperService.writeStringIfValid(individualDetails?.individualSurname);
        return surname + (surname.length > 0 && forenames.length > 0 ? ', ' : '') + forenames;
    }

    private createOrganisationDetails(organisationDetails: any) {
        return ListParseHelperService.writeStringIfValid(organisationDetails?.organisationName);
    }
}
