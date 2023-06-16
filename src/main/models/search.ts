import { SearchCase } from './searchCase';
import { SearchParty } from './searchParty';

export interface Search {
    cases: SearchCase[];
    parties: SearchParty[];
}
