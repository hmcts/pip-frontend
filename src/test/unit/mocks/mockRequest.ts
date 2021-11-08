import {PipRequest} from '../../../main/models/request/PipRequest';

export const mockRequest = (data: any): PipRequest => {
  const req: any = {
    body: '',
    i18n: {
      getDataByLanguage: '',
    },
  };
  req.body = jest.fn().mockReturnValue(req);
  req.i18n.getDataByLanguage = jest.fn().mockReturnValue(data);
  req.isAuthenticated = jest.fn().mockReturnValue(req);
  return req;
};
