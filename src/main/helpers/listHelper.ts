import { HttpStatusCode } from 'axios';
import { PublicationService } from '../service/PublicationService';

const publicationService = new PublicationService();

export const isValidList = (listData: any, metaData: any): boolean => {
    return listData && listData !== HttpStatusCode.NotFound && isValidMetaData(metaData);
};

export const isValidMetaData = (metaData: any): boolean => {
    return metaData && metaData !== HttpStatusCode.NotFound;
};

export const formatMetaDataListType = (metaData: any): string => {
    return metaData?.listType ? metaData.listType.toLowerCase().replaceAll('_', '-') : '';
};

export const getParentPage = (listType: string): string => {
    return publicationService.getListTypes().get(listType)?.['parentPage'];
};

export const isValidListType = (metaDataListType: string, listType: string): boolean => {
    return metaDataListType === listType;
};

export const isOneOfValidListTypes = (metaDataListType: string, listType: string, altListType: string): boolean => {
    return metaDataListType === listType || metaDataListType === altListType;
};

export const missingListType = (metaDataListType: string): boolean => {
    return metaDataListType === '';
};

export const isUnexpectedListType = (metaDataListType: string, listType: string): boolean => {
    return !missingListType(metaDataListType) && !isValidListType(metaDataListType, listType);
};

export const addListDetailsToArray = async (artefactId: string, userId: any, lists: any[]) => {
    lists.push(await publicationService.getIndividualPublicationMetadata(artefactId, userId, true));
};
