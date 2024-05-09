import { HttpStatusCode } from 'axios';
import { PublicationService } from '../service/PublicationService';

const publicationService = new PublicationService();
export const isValidList = (searchResults: any, metaData: any): any => {
    if (
        (searchResults !== null && searchResults !== HttpStatusCode.NotFound) ||
        (searchResults !== null && metaData !== HttpStatusCode.NotFound)
    ) {
        return true;
    } else {
        return false;
    }
};

// TODO: To be removed once all lists have party field on the case level.
export const hearingHasParty = (jsonData): boolean => {
    let hearingHasParty = false;
    jsonData.courtLists.forEach(courtList => {
        courtList.courtHouse.courtRoom.forEach(courtRoom => {
            courtRoom.session.forEach(session => {
                session.sittings.forEach(sitting => {
                    sitting.hearing.forEach(hearing => {
                        if (hearing.party) {
                            hearingHasParty = true;
                        }
                    });
                });
            });
        });
    });
    return hearingHasParty;
};

export const getListDetailsArray = async (artefactId: string, userId: any, lists: any[]) => {
    lists.push(await publicationService.getIndividualPublicationMetadata(artefactId, userId, true));
};
