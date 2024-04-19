import { SearchCase } from './SearchCase';
import { SearchIndividual } from './SearchIndividual';

export interface SearchParty {
    cases: SearchCase[];
    individuals: SearchIndividual[];
    organisations: string[];
}
