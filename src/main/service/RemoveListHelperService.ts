import { PublicationService } from './PublicationService';

const publicationService = new PublicationService();
export class RemoveListHelperService {
    public async removeLists(artefactIds: any, userId: string) {
        let response = true;
        if (Array.isArray(artefactIds)) {
            for (const artefactId of artefactIds) {
                response = await publicationService.removePublication(artefactId, userId);
                if (!response) {
                    return false;
                }
            }
        } else {
            response = await publicationService.removePublication(artefactIds, userId);
        }
        return response;
    }

    public formatArtefactIdsForAudit(artefactIds: any) {
        if (Array.isArray(artefactIds)) {
            return `Publications with artefact ids ${artefactIds.join(', ')} successfully deleted`;
        } else {
            return `Publication with artefact id ${artefactIds.toString()} successfully deleted`;
        }
    }

    public getSelectedLists(formData: { courtLists: any }): string[] {
        const { courtLists } = formData;
        const listsToDelete = [];
        if (courtLists !== undefined) {
            RemoveListHelperService.addListsToArray(courtLists, listsToDelete);
        }
        return listsToDelete;
    }

    private static addListsToArray(lists: any, listsToDelete: any[]): void {
        if (Array.isArray(lists)) {
            listsToDelete.push(...lists);
        } else {
            listsToDelete.push(lists);
        }
    }
}
