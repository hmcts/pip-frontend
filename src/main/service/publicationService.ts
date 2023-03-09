import { PublicationRequests } from '../resources/requests/publicationRequests';
import { Artefact } from '../models/Artefact';
import { SearchObject } from '../models/searchObject';
import { ListType } from '../models/listType';

const listData = require('../resources/listLookup.json');
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

    public async getIndividualPublicationFile(artefactId, userId: string): Promise<Blob> {
        return publicationRequests.getIndividualPublicationFile(artefactId, userId);
    }

    public async getIndividualPublicationJson(artefactId, userId: string): Promise<JSON> {
        return publicationRequests.getIndividualPublicationJson(artefactId, userId);
    }

    public async getCasesByCaseName(caseName: string, userId: string): Promise<SearchObject[]> {
        const artefacts = await publicationRequests.getPublicationByCaseValue('CASE_NAME', caseName, userId);
        return this.getFuzzyCasesFromArtefact(artefacts, caseName);
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
        artefact?.search.cases.forEach(singleCase => {
            if (singleCase[term] == value) {
                foundObject = singleCase;
            }
        });
        return foundObject;
    }

    private getFuzzyCasesFromArtefact(artefacts: Artefact[], value: string): SearchObject[] {
        const matches: SearchObject[] = [];
        artefacts.forEach(artefact => {
            artefact.search.cases.forEach(singleCase => {
                if (singleCase.caseName && singleCase.caseName.toLowerCase().includes(value.toLowerCase())) {
                    const alreadyExists = matches.find(
                        m =>
                            m.caseName === singleCase.caseName &&
                            m.caseUrn === singleCase.caseUrn &&
                            m.caseNumber === singleCase.caseNumber
                    );
                    if (!alreadyExists) {
                        matches.push(singleCase);
                    }
                }
            });
        });
        return matches;
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
        if (listMetadata && listMetadata[1]) {
            return listMetadata[1]['defaultSensitivity'];
        }
        return '';
    }

    /**
     * Function which takes in the list and users language.
     * Returns what language the page should be rendered in.
     *
     * @param listLanguage A string of the lists language
     * @param userLanguage A string of the users language
     * @return Returns the language to render the page in options are: en, cy, bill
     */
    public languageToLoadPageIn(listLanguage: string, userLanguage: string): string {
        if (
            listLanguage === 'BI_LINGUAL' ||
            (listLanguage === 'ENGLISH' && userLanguage !== 'en') ||
            (listLanguage === 'WELSH' && userLanguage !== 'cy')
        ) {
            return 'bill';
        } else {
            return userLanguage;
        }
    }

    public async deleteLocationPublication(locationId: number, requester: string): Promise<object> {
        return await publicationRequests.deleteLocationPublication(locationId, requester);
    }
}
