import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

describe('Home page', () => {
  it('should display header', async () => {
    await request(app)
      .get('/')
      .expect((res) =>
      {
        expect(res.text).contains('Find a court or tribunal listing', 'Could not find the header');
      });
  });

  it('should display button start', async () => {
    await request(app)
      .get('/')
      .expect((res) =>
      {
        const button = 'govuk-button govuk-button--start';
        expect(res.text).contains(button, 'Could not find the button');
      });
  });

});
