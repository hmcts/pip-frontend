import { PublicationRequests } from '../resources/requests/PublicationRequests';
import { Artefact } from '../models/Artefact';
import { ListType } from '../models/ListType';
import listData from '../resources/listLookup.json';
import { CaseSearchResults } from 'models/CaseSearchResults';
import { HttpStatusCode } from 'axios';

const publicationRequests = new PublicationRequests();

export class PublicationService {
    public async getIndividualPublicationMetadata(artefactId, userId: string, admin = false): Promise<any> {
        return publicationRequests.getIndividualPublicationMetadata(artefactId, userId, admin);
    }

    public async getPublicationMetadataWithCaseInfo(artefactId, userId: string, admin = false): Promise<any> {
        const metadata = await publicationRequests.getIndividualPublicationMetadata(artefactId, userId, admin);
        if (metadata && metadata !== HttpStatusCode.NotFound) {
            const caseInfoList = await publicationRequests.getCasesByArtefactId(artefactId, userId);
            return {
                ...metadata,
                caseInfoList,
            }
        }
        return metadata;
    }

    public async getCountsOfPubsPerLocation(requesterId: string): Promise<Map<string, number>> {
        const response = await publicationRequests.getPubsPerLocation(requesterId);
        const map = new Map();
        response.forEach(countPerLocation => {
            map.set(countPerLocation.locationId, countPerLocation.totalArtefacts);
        });
        return map;
    }

    public async getIndividualPublicationFile(artefactId, userId: string): Promise<Blob | number> {
        return publicationRequests.getIndividualPublicationFile(artefactId, userId);
    }

    public async getIndividualPublicationJson(artefactId, userId: string): Promise<JSON | number> {
        return publicationRequests.getIndividualPublicationJson(artefactId, userId);
    }

    public async getCaseByCaseNumber(searchValue: string, userId: string): Promise<CaseSearchResults> {
        const results = await publicationRequests.getCasesByCaseNumber(searchValue, userId);
        return results.length > 0 ? results[0] : null;
    }

    public async getCasesByCaseName(
        searchValue: string,
        userId: string,
        fuzzySearch = false
    ): Promise<CaseSearchResults[]> {
        return await publicationRequests.getCasesByCaseName(searchValue, userId, fuzzySearch);
    }

    public async getPublicationsByLocation(locationId: string, userId: string, admin = false): Promise<Artefact[]> {
        return await publicationRequests.getPublicationsByLocation(locationId, userId, admin);
    }

    public async getNoMatchPublications(userId: string): Promise<Artefact[]> {
        return publicationRequests.getNoMatchPublications(userId);
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

    public async getListSearchConfigByListType(listType: string, userId: string): Promise<any> {
        return await publicationRequests.getListSearchConfigByListType(listType, userId);
    }

    public async createListSearchConfig(formData, userId: string): Promise<any> {
        return await publicationRequests.createListSearchConfig(
            this.createListSearchConfigPayload(
                '',
                formData.listType,
                formData.caseNumberFieldName,
                formData.caseNameFieldName
            ),
            userId
        );
    }

    public async updateListSearchConfig(id: string, formData, userId: string): Promise<any> {
        return await publicationRequests.updateListSearchConfig(
            id,
            this.createListSearchConfigPayload(
                id,
                formData.listType,
                formData.caseNumberFieldName,
                formData.caseNameFieldName
            ),
            userId
        );
    }

    private createListSearchConfigPayload(
        id: string,
        listType: string,
        caseNumberFieldName: string,
        caseNameFieldName: string
    ): any {
        return {
            id,
            listType,
            caseNumberFieldName,
            caseNameFieldName,
        };
    }
}
