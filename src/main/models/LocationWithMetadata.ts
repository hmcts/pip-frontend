import { LocationMetadata } from 'models/LocationMetadata';
import { Location } from 'models/Location';

export interface LocationWithMetadata {
    location: Location;
    metadata: LocationMetadata | null;
}
