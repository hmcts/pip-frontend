import { Cases } from './cases';

export interface Artefact {
  artefactId: string;
  provenance: string;
  sourceArtefactId: string;
  artefactType: string;
  sensitivity: string;
  language: string;
  search: Cases;
  displayFrom: string;
  displayTo: string;
  listType: string;
  locationId: string;
  contentDate: string;
  isFlatFile: boolean;
  payload: object;
}
