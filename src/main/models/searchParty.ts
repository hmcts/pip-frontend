import { SearchCase } from './searchCase';
import { SearchIndividual } from './searchIndividual';

export interface SearchParty {
    cases: SearchCase[];
    individuals: SearchIndividual[];
    organisations: string[];
}
