import { ListParseHelperService } from '../ListParseHelperService';
import { SjpPressList } from '../../models/style-guide/sjp-press-list-model';
import { SjpFilterService } from '../../service/SjpFilterService';

const sjpFilterService = new SjpFilterService();

export class SjpPublicListService {
    /**
     * Format the SJP public list json data for writing out on screen.
     * @param formatSjpPublicList SJP list raw data
     */
    public formatSjpPublicList(sjpPublicListJson: JSON, sjpModel: SjpPressList): void {
        sjpPublicListJson['courtLists'].forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            this.buildCases(hearing, sjpModel);
                        });
                    });
                });
            });
        });
    }

    private buildCases(hearing, sjpModel: SjpPressList): any {
        const hasFilterValues: boolean = sjpModel.currentFilterValues.length > 0;
        const partyDetails = this.buildPartyDetails(hearing.party);
        const offence = this.buildOffence(hearing.offence);

        if (partyDetails.name && partyDetails.postcode && partyDetails.prosecutorName && offence) {
            sjpModel.addTotalCaseNumber();

            if (partyDetails.postcode) {
                sjpModel.addPostcode(partyDetails.postcode);
            }
            if (partyDetails.prosecutorName) {
                sjpModel.addProsecutor(partyDetails.prosecutorName);
            }

            const row = {
                ...partyDetails,
                offence: offence,
            };

            if (!hasFilterValues || sjpFilterService.filterSjpCase(row, sjpModel.currentFilterValues)) {
                sjpModel.countOfFilteredCases++;
                if (sjpModel.isRowWithinPage()) {
                    sjpModel.addFilteredRow(row);
                }
            }
        }
    }

    private buildPartyDetails(parties) {
        let accusedInfo = { name: '', postcode: '' };
        let organisationName = '';
        parties.forEach(party => {
            if (party.partyRole === 'ACCUSED') {
                accusedInfo = this.processAccusedParty(party);
            } else if (party.partyRole === 'PROSECUTOR') {
                organisationName = party.organisationDetails.organisationName;
            }
        });

        return {
            ...accusedInfo,
            prosecutorName: organisationName,
        };
    }

    private processAccusedParty(party) {
        if (party.individualDetails) {
            const individual = party.individualDetails;
            return {
                name: this.buildIndividualName(individual),
                postcode: individual.address?.postCode ? individual.address.postCode : '',
            };
        } else if (party.organisationDetails) {
            const organisation = party.organisationDetails;
            return {
                name: organisation.organisationName,
                postcode: organisation.organisationAddress ? organisation.organisationAddress.postCode : '',
            };
        }
    }

    private buildIndividualName(individual) {
        const forenames = ListParseHelperService.writeStringIfValid(individual?.individualForenames);
        const surname = ListParseHelperService.writeStringIfValid(individual?.individualSurname);
        return [forenames, surname].filter(n => n.length > 0).join(' ');
    }

    private buildOffence(offences): any {
        let offenceTitle = '';
        offences.forEach(offence => {
            if (offenceTitle.length > 0) {
                offenceTitle = [offenceTitle, offence.offenceTitle].join(', ');
            } else {
                offenceTitle = offence.offenceTitle;
            }
        });
        return offenceTitle;
    }
}
