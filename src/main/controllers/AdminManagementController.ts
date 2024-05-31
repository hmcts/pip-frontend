import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { AccountManagementRequests } from '../resources/requests/AccountManagementRequests';
import { cloneDeep } from 'lodash';

const accountManagementRequests = new AccountManagementRequests();
export default class AdminManagementController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        res.render('admin-management', {
            ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['admin-management']),
            noResultsError: req.query['error'] === 'true',
        });
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const searchInput = req.body['search-input'];

        if (searchInput?.length) {
            const searchResults = await accountManagementRequests.getAdminUserByEmailAndProvenance(
                searchInput,
                'SSO', // PROVENANCE PI_AAD & SSO NEED TO BE ALLOWED FOR FULL SEARCH
                req.user['userId']
            );

            searchResults
                ? res.redirect(`manage-user?id=${searchResults.userId}`)
                : res.redirect('admin-management?error=true');
        } else {
            res.redirect('admin-management?error=true');
        }
    }
}
