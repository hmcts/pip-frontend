import { PublicationService } from './PublicationService';
import {UserManagementService} from "./UserManagementService";

const publicationService = new PublicationService();
const userManagementService = new UserManagementService();

export class RemoveListHelperService {
    public async removeLists(artefactIds: any, user: object) {
        let response = true;
        if (Array.isArray(artefactIds)) {
            for (const artefactId of artefactIds) {
                response = await this.removeList(artefactId, user);
                if (!response) {
                    return false;
                }
            }
        } else {
            response = await this.removeList(artefactIds, user);
        }
        return response;
    }

    private async removeList(artefactId: string, user: object) {
        const response = await publicationService.removePublication(artefactId, user?.['userId']);
        if (response) {
            await userManagementService.auditAction(
                user,
                'DELETE_PUBLICATION',
                `Publication with artefact id ${artefactId} successfully deleted`
            );
        }
        return response;
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
