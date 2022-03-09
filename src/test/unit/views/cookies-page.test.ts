import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/cookies';
const headingClass = 'govuk-heading-l';
const tableCaptionClass = 'govuk-table__caption';
const tableCellClass = 'govuk-table';

let htmlRes: Document;

describe('Cookies page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Cookies', 'Could not find the header');
  });

  it('should display table caption', () =>{
    const tableCaption = htmlRes.getElementsByClassName(tableCaptionClass);
    expect(tableCaption[0].innerHTML).contains('Essential Cookies', 'Table caption not rendered');
  });

  it('should display table cells', () =>{
    const table = htmlRes.getElementsByClassName(tableCellClass);
    expect(table[0].innerHTML).contains('session', 'Table cells not rendered');
  });
});
