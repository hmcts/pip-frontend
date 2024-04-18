import { PipRequest } from '../models/request/PipRequest';
import { Response } from 'express';
import { cloneDeep } from 'lodash';
import { UserManagementService } from '../service/userManagementService';
import { UserSearchCriteria } from '../models/UserSearchCriteria';

const userManagementService = new UserManagementService();
export default class UserManagementController {
    public async get(req: PipRequest, res: Response): Promise<void> {
        // If clear is in the query then call the handle function then redirect
        // to the page with the updated list of filter values
        if (req.query?.clear) {
            const responseBody = userManagementService.handleFilterClearing(req.query);
            const filterValues = userManagementService.generateFilterKeyValues(responseBody);
            res.redirect(`user-management?${filterValues}`);
        } else {
            const pageData = await userManagementService.getFormattedData(
                new UserSearchCriteria(
                    req.query?.page,
                    req.query?.email,
                    req.query?.userId,
                    req.query?.userProvenanceId,
                    req.query?.roles,
                    req.query?.provenances
                ),
                req.url.split('/user-management')[1],
                req.user
            );

            res.render('user-management', {
                ...cloneDeep(req.i18n.getDataByLanguage(req.lng)['user-management']),
                header: userManagementService.getTableHeaders(),
                userData: pageData['userData'],
                paginationData: pageData['paginationData'],
                emailFieldData: pageData['emailFieldData'],
                userIdFieldData: pageData['userIdFieldData'],
                userProvenanceIdFieldData: pageData['userProvenanceIdFieldData'],
                provenancesFieldData: pageData['provenancesFieldData'],
                rolesFieldData: pageData['rolesFieldData'],
                categories: pageData['categories'],
            });
        }
    }

    public async post(req: PipRequest, res: Response): Promise<void> {
        const filterValues = userManagementService.generateFilterKeyValues(req.body);
        res.redirect(`user-management?${filterValues}`);
    }
}
