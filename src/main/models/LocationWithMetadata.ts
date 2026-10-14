import { LocationMetadata } from 'models/LocationMetadata';

export interface LocationWithMetadata {
    location: Location;
    metadata: LocationMetadata | null;
}
