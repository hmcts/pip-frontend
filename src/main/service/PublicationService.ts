import { PublicationRequests } from '../resources/requests/PublicationRequests';
import { Artefact } from '../models/Artefact';
import { ListType } from '../models/ListType';
import { SearchObject } from '../models/SearchObject';
import { HttpStatusCode } from 'axios';
import { SearchParty } from '../models/SearchParty';
import { SearchCase } from '../models/SearchCase';
import listData from '../resources/listLookup.json';

const publicationRequests = new PublicationRequests();

export class PublicationService {
    public async getIndividualPublicationMetadata(artefactId, userId: string, admin = false): Promise<any> {
        return publicationRequests.getIndividualPublicationMetadata(artefactId, userId, admin);
    }

    public async getCountsOfPubsPerLocation(): Promise<Map<string, number>> {
        const response = await publicationRequests.getPubsPerLocation();
        const map = new Map();
        response.forEach(countPerLocation => {
            map.set(countPerLocation.locationId, countPerLocation.totalArtefacts);
        });
        return map;
    }

    public async getIndividualPublicationFile(artefactId, userId: string): Promise<Blob | HttpStatusCode> {
        return publicationRequests.getIndividualPublicationFile(artefactId, userId);
    }

    public async getIndividualPublicationJson(artefactId, userId: string): Promise<JSON | HttpStatusCode> {
        return publicationRequests.getIndividualPublicationJson(artefactId, userId);
    }

    public async getCasesByCaseName(caseName: string, userId: string): Promise<object[]> {
        const artefacts = await publicationRequests.getPublicationByCaseValue('CASE_NAME', caseName, userId);
        const searchResults = this.getFuzzyCasesFromArtefact(artefacts, caseName);

        const formattedResults = [];
        searchResults.forEach(searchResult => {
            if (searchResult.caseNumber) {
                formattedResults.push(searchResult);
            }

            if (searchResult.caseUrn) {
                const newSearchResult = JSON.parse(JSON.stringify(searchResult));
                newSearchResult['displayUrn'] = true;
                formattedResults.push(newSearchResult);
            }
        });

        return formattedResults;
    }

    public async getCaseByCaseNumber(caseNumber: string, userId: string): Promise<SearchObject> | null {
        const artefact = await publicationRequests.getPublicationByCaseValue('CASE_ID', caseNumber, userId);
        return this.getCaseFromArtefact(artefact[0], 'caseNumber', caseNumber);
    }

    public async getCaseByCaseUrn(urn: string, userId: string): Promise<SearchObject> | null {
        const artefact = await publicationRequests.getPublicationByCaseValue('CASE_URN', urn, userId);
        return this.getCaseFromArtefact(artefact[0], 'caseUrn', urn);
    }

    public async getPublicationsByCourt(locationId: string, userId: string): Promise<Artefact[]> {
        return await publicationRequests.getPublicationsByCourt(locationId, userId, false);
    }

    private getCaseFromArtefact(artefact: Artefact, term: string, value: string): SearchObject {
        let foundObject: SearchObject = null;

        if (artefact?.search.parties) {
            artefact?.search.parties.forEach(party => {
                const partyNames = this.constructPartyNames(party);
                party.cases.forEach(singleCase => {
                    if (singleCase[term] == value) {
                        foundObject = { ...singleCase, partyNames };
                    }
                });
            });
        } else {
            artefact?.search.cases.forEach(singleCase => {
                if (singleCase[term] == value) {
                    foundObject = { ...singleCase, partyNames: '' };
                }
            });
        }
        return foundObject;
    }

    private getFuzzyCasesFromArtefact(artefacts: Artefact[], value: string): SearchObject[] {
        const matches: SearchObject[] = [];
        artefacts.forEach(artefact => {
            if (artefact?.search.parties) {
                artefact.search.parties.forEach(party => {
                    const partyNames = this.constructPartyNames(party);
                    party.cases.forEach(singleCase => {
                        if (singleCase.caseName?.toLowerCase().includes(value.toLowerCase())) {
                            this.storeUniquePartyCases(matches, singleCase, partyNames);
                        }
                    });
                });
            } else {
                artefact.search.cases.forEach(singleCase => {
                    if (singleCase.caseName?.toLowerCase().includes(value.toLowerCase())) {
                        const alreadyExists = matches.find(
                            m =>
                                m.caseName === singleCase.caseName &&
                                m.caseUrn === singleCase.caseUrn &&
                                m.caseNumber === singleCase.caseNumber
                        );

                        if (!alreadyExists) {
                            matches.push({ ...singleCase, partyNames: '' });
                        }
                    }
                });
            }
        });
        return matches;
    }

    private constructPartyNames(party: SearchParty): string {
        const parties = [];

        party.individuals?.forEach(i => {
            const nameItems = [];
            if (i.forename) {
                nameItems.push(i.forename);
            }
            if (i.middleName) {
                nameItems.push(i.middleName);
            }
            if (i.surname) {
                nameItems.push(i.surname);
            }
            parties.push(nameItems.join(' '));
        });

        party.organisations?.forEach(o => parties.push(o));
        return parties.join(',\n');
    }

    private storeUniquePartyCases(matches: SearchObject[], singleCase: SearchCase, partyNames: string) {
        const alreadyExists = matches.find(
            m =>
                m.caseName === singleCase.caseName &&
                m.caseUrn === singleCase.caseUrn &&
                m.caseNumber === singleCase.caseNumber &&
                m.partyNames === partyNames
        );

        if (!alreadyExists) {
            matches.push({ ...singleCase, partyNames });
        }
    }

    /**
     * Service method to remove a publication.
     * @param artefactId The artefact ID to remove.
     * @param id The ID of the user.
     */
    public async removePublication(artefactId: string, id: string): Promise<boolean> {
        return publicationRequests.archivePublication(artefactId, id);
    }

    /**
     * Service method which retrieves list types and their associated metadata.
     */
    public getListTypes(): Map<string, ListType> {
        return new Map(Object.entries(listData));
    }

    /**
     * Service method that retrieves the default sensitivity for a list type
     * @param listType The list type to retrieve the sensitivity for.
     */
    public getDefaultSensitivity(listType: string) {
        const listMetadata = Object.entries(listData).find(([key]) => key === listType);
        if (listMetadata?.[1]) {
            return listMetadata[1]['defaultSensitivity'];
        }
        return '';
    }

    public async deleteLocationPublication(locationId: number, userId: string): Promise<object> {
        return await publicationRequests.deleteLocationPublication(locationId, userId);
    }
}
