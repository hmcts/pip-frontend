import { ListParseHelperService } from '../ListParseHelperService';
import { SjpModel } from '../../models/style-guide/sjp-model';
import { SjpFilterService } from '../SjpFilterService';

const sjpFilterService = new SjpFilterService();

export class SjpPublicListService {
    /**
     * Format the SJP public list json data for writing out on screen.
     * @param sjpPublicListJson The JSON data for the list
     * @param sjpModel The model to store the formatted data, and metadata while processing
     */
    public formatSjpPublicList(sjpPublicListJson: JSON, sjpModel: SjpModel): void {
        const hasFilterValues: boolean = sjpModel.getCurrentFilterValues().length > 0;
        sjpPublicListJson['courtLists'].forEach(courtList => {
            courtList.courtHouse.courtRoom.forEach(courtRoom => {
                courtRoom.session.forEach(session => {
                    session.sittings.forEach(sitting => {
                        sitting.hearing.forEach(hearing => {
                            this.buildCases(hearing, sjpModel, hasFilterValues);
                        });
                    });
                });
            });
        });
    }

    /**
     * Builds the cases for each of the hearings in the list.
     * @param hearing The hearing object in the data.
     * @param sjpModel The SJP model to update with the metadata.
     * @param hasFilterValues whether there are filter values associated with the request.
     * @private
     */
    private buildCases(hearing: any, sjpModel: SjpModel, hasFilterValues: boolean): any {
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

            if (!hasFilterValues || sjpFilterService.filterSjpCase(row, sjpModel.getCurrentFilterValues())) {
                sjpModel.incrementCountOfFilteredCases();
                if (sjpModel.isRowWithinPage()) {
                    sjpModel.addFilteredCaseForPage(row);
                }
            }
        }
    }

    private buildPartyDetails(parties: any) {
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

    private processAccusedParty(party: any) {
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

    private buildIndividualName(individual: any) {
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
