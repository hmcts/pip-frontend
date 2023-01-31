export interface Publication {
    artefactId: string;
    provenance: string;
    type: string;
    sensitivity: string;
    language: string;
    displayFrom: string;
    displayTo: string;
    listType: string;
    locationId: number;
    contentDate: string;
    isFlatFile: boolean;
    payload: string;
}
