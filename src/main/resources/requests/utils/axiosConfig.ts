import axios from 'axios';
import {DATA_MANAGEMENT_URL} from '../../../../../config/globalEnvs';

export const dataManagementApi = axios.create({baseURL: (DATA_MANAGEMENT_URL)});
