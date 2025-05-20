export interface ListType {
    friendlyName: string;
    welshFriendlyName: string;
    shortenedFriendlyName: string;
    url: string;
    jurisdictionTypes: Array<string>;
    restrictedProvenances: Array<string>;
    defaultSensitivity: string;
    contDate?: string;
    checked?: boolean;
    isNonStrategic?: boolean;
}
