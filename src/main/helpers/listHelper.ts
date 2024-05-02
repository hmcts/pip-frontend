import { HttpStatusCode } from 'axios';

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

export const formatMetaDataListType = (metaData: any): any => {
    if (metaData) {
        return metaData.listType.toLowerCase().replaceAll('_', '-');
    } else {
        return '';
    }
}

export const isValidListType = (metaDataListType: any, listType: any): any => {
    return metaDataListType === listType;
}

export const isOneOfValidListTypes = (metaDataListType: any, listType: any, altListType: any): any => {
    return metaDataListType === listType || metaDataListType === altListType;
}

export const missingListType = (metaDataListType: any): any => {
    return metaDataListType === '';
}

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
