import { ListParseHelperService } from '../listParseHelperService';
import { calculateDurationSortValue, formatDuration } from '../../helpers/dateTimeHelper';

const helperService = new ListParseHelperService();
const separator = ', ';

/**
 * Service class provides reusable methods for crime list templates:
 *   Crown Daily List
 *   Magistrates Public List
 */
export class CrimeListsService {
    public manipulateCrimeListData(crimeListData: string, language: string, languageFile: string): object {
        const crownDailyListData = JSON.parse(crimeListData);
        crownDailyListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                courtRoom['session'].forEach(session => {
                    session['sittings'].forEach(sitting => {
                        helperService.formatCaseTime(sitting, 'h:mma');
                        sitting['formattedDuration'] = formatDuration(
                            sitting['durationAsDays'] as number,
                            sitting['durationAsHours'] as number,
                            sitting['durationAsMinutes'] as number,
                            language,
                            languageFile
                        );
                        sitting['durationSortValue'] = calculateDurationSortValue(
                            sitting['durationAsDays'] as number,
                            sitting['durationAsHours'] as number,
                            sitting['durationAsMinutes'] as number
                        );
                        sitting['hearing'].forEach(hearing => {
                            this.manipulateParty(hearing);
                            this.findLinkedCasesInformation(hearing);
                        });
                    });
                });
            });
        });
        return crownDailyListData;
    }

    private pushIfExists(array, item) {
        if (item.length > 0) {
            array.push(item);
        }
    }

    public manipulateParty(hearing: any): void {
        const defendants = [];
        const defendantRepresentatives = [];
        const prosecutingAuthorities = [];

        hearing?.party?.forEach(party => {
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
        hearing.defendant = defendants.join(separator);
        hearing.defendantRepresentative = defendantRepresentatives.join(separator);
        hearing.prosecutingAuthority = prosecutingAuthorities.join(separator);
    }

    public createIndividualDetails(individualDetails: any): string {
        const forenames = ListParseHelperService.writeStringIfValid(individualDetails?.individualForenames);
        const surname = ListParseHelperService.writeStringIfValid(individualDetails?.individualSurname);
        return surname + (surname.length > 0 && forenames.length > 0 ? ', ' : '') + forenames;
    }

    private createOrganisationDetails(organisationDetails: any) {
        return ListParseHelperService.writeStringIfValid(organisationDetails?.organisationName);
    }

    public findLinkedCasesInformation(hearing: any): void {
        let linkedCases = '';
        let listingNotes = '';

        hearing.case.forEach(cases => {
            linkedCases = '';
            cases.caseLinked?.forEach(caseLinked => {
                linkedCases += caseLinked.caseId.trim();
                linkedCases += helperService.stringDelimiter(linkedCases?.length, ',');
            });

            cases['linkedCases'] = linkedCases?.replace(/,\s*$/, '').trim();
        });

        if (hearing?.listingDetails) {
            listingNotes += hearing.listingDetails.listingRepDeadline.trim();
            listingNotes += helperService.stringDelimiter(listingNotes?.length, ',');
        }

        hearing['listingNotes'] = listingNotes?.replace(/,\s*$/, '').trim();
    }

    public findUnallocatedCasesInCrownDailyListData(crimeListData: string): Array<object> {
        const unallocatedCasesCrownListData = JSON.parse(crimeListData);
        const unallocatedCases = [];
        let courtListForUnallocatedCases;
        unallocatedCasesCrownListData['courtLists'].forEach(courtList => {
            courtList['courtHouse']['courtRoom'].forEach(courtRoom => {
                if (courtRoom.courtRoomName.includes('to be allocated')) {
                    const courtRoomCopy = JSON.parse(JSON.stringify(courtRoom));
                    unallocatedCases.push(courtRoomCopy);
                    courtRoom['exclude'] = true;
                }
            });
            courtListForUnallocatedCases = JSON.parse(JSON.stringify(courtList));
        });

        if (unallocatedCases.length > 0) {
            this.formatUnallocatedCourtList(
                unallocatedCasesCrownListData,
                courtListForUnallocatedCases,
                unallocatedCases
            );
        }
        return unallocatedCasesCrownListData;
    }

    private formatUnallocatedCourtList(
        unallocatedCasesCrownListData: object,
        courtListForUnallocatedCases: object,
        unallocatedCase: any[]
    ): void {
        courtListForUnallocatedCases['courtHouse']['courtHouseName'] = '';
        courtListForUnallocatedCases['courtHouse']['courtHouseAddress'] = null;
        courtListForUnallocatedCases['unallocatedCases'] = true;
        courtListForUnallocatedCases['courtHouse']['courtRoom'] = unallocatedCase;
        unallocatedCasesCrownListData['courtLists'].push(courtListForUnallocatedCases);
    }
}
