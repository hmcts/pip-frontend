import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

describe('Search option Page', () => {
  it('should display header', async () => {
    await request(app)
      .get('/search-option')
      .expect((res) =>
      {
        expect(res.text).contains('Find a court or tribunal list', 'Could not find the header');
      });
  });

  it('should display  only 1 button', async () => {
    await request(app)
      .get('/search-option')
      .expect((res) =>
      {
        const documentFragment = new DOMParser().parseFromString(res.text, 'text/html');

        // retrieve a list of buttons from the fragment
        const buttons = documentFragment.getElementsByTagName('button');
        expect(buttons.length).equal(1, 'pippo');
      });
  });

  it('should display button continue', async () => {
    await request(app)
      .get('/search-option')
      .expect((res) =>
      {
        const documentFragment = new DOMParser().parseFromString(res.text, 'text/html');
        console.log(documentFragment);
        // retrieve a list of buttons from the fragment
        const buttons = documentFragment.getElementsByClassName('govuk-button');

        expect(buttons[0].innerHTML).contains('Continue', 'pippo');
      });
  });

  it('should display radio button', async () => {
    await request(app)
      .get('/search-option')
      .expect((res) =>
      {
        // let documentFragment = new DOMParser().parseFromString(res.text, 'text/html');
        // retrieve a list of buttons from the fragment
        //let buttons = documentFragment.getElementsByTagName('button');
        //const button = 'govuk-button';
        //expect(res.text).contains(button, 'Could not find the button');
      });
  });
});
