import {graphApi} from "../resources/requests/utils/axiosConfig";
import {LogHelper} from "../resources/logging/logHelper";

const logHelper = new LogHelper();

export const getSsoUserGroups = async (oid, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': "application/json",
    }

    try {
        const response = await graphApi
            .post(`/users/${oid}/getMemberObjects`, JSON.stringify({"securityEnabledOnly": true}), {
                headers: headers,
            });
        return response.data;
    } catch(error) {
        logHelper.logErrorResponse(error, 'retrieve SSO user groups with Microsoft Graph API');
        return null;
    };
};
