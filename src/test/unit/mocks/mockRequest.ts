import {PipRequest} from '../../../main/models/request/PipRequest';

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
  };
  req.body = jest.fn().mockReturnValue(req);
  req.i18n.getDataByLanguage = jest.fn().mockReturnValue(data);
<<<<<<< HEAD
  req.isAuthenticated = jest.fn().mockReturnValue(req);
=======
  req.user = jest.fn().mockReturnValue(req);
>>>>>>> 9477a9ec729f77a71f72c28faa774b6661325b31
  return req;
};
