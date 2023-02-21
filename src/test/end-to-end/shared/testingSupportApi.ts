import axios from 'axios';
import {config as testConfig} from '../../config';

export const deleteLocation = async (locationId: string) => {
   try {
    await axios.delete(
      `${testConfig.DATA_MANAGEMENT_BASE_URL}/locations/${locationId}`,
      {
        headers: {'x-provenance-user-id': 'e5f1cc77-6e9a-40ab-8da0-a9666b328464'},
      }
    );
  } catch (e) {
    throw new Error(`Failed to delete location with locationId: ${locationId}, http-status: ${e.response?.status}`);
  }
};


