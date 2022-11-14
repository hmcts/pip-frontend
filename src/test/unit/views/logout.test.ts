import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/logout';

describe('Log out from page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL);
  });

  it('should run req.session.destroy() when the url is called', () => {
    request(app).get(PAGE_URL, function (req, res: any) {
      expect(res.clearCookie('session').toHaveBeenCalled());
    });
  });
});
