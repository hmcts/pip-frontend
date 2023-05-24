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
