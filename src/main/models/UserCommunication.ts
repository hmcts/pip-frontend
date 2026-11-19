export interface UserCommunication {
    id: string;
    audienceType: string;
    message: string;
    welshMessage: string;
    userProvenances: Array<string>;
    userRoles: Array<string>;
    subJurisdictions: Array<string>;
    venues: Array<string>;
}
