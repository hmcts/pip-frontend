import { PipRequest } from '../../../main/models/request/PipRequest';

export const mockRequest = (data: any): PipRequest => {
    const req: any = {
        body: '',
        i18n: {
            getDataByLanguage: '',
        },
        user: {
            id: '1',
            username: '',
            userType: 'media',
        },
        lng: 'en',
        params: {},
    };
    req.body = jest.fn().mockReturnValue(req);
    req.i18n.getDataByLanguage = jest.fn().mockReturnValue(data);
    req.user = jest.fn().mockReturnValue(req);
    req.file = jest.fn().mockReturnValue(req);
    return req;
};
