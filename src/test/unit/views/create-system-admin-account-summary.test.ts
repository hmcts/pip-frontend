import request from 'supertest';
import { app } from '../../../main/app';
import sinon from 'sinon';
import { expect } from 'chai';
import { CreateAccountService } from '../../../main/service/createAccountService';
import {request as expressRequest} from 'express';

const PAGE_URL = '/create-system-admin-account-summary';
const cookie = {
  firstName: 'Test',
  lastName: 'Name',
  emailAddress: 'TestEmail',
  userRoleObject: {
    mapping: 'SYSTEM_ADMIN',
  },
};
const summaryKeys = ['First name', 'Last name', 'Email address'];
const changeValues = ['firstName', 'lastName', 'emailAddress'];
let htmlRes: Document;
const createAccountStub = sinon.stub(CreateAccountService.prototype, 'createSystemAdminAccount');

expressRequest['user'] = {'_json': {
  'extension_UserRole': 'SYSTEM_ADMIN',
}};

describe('Create System Admin Account Summary page', () => {
  describe('on GET', () => {
    beforeAll(async () => {
      app.request['cookies'] = {
        createAdminAccount: JSON.stringify(cookie),
      };
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        htmlRes.getElementsByTagName('div')[0].remove();
      });
    });

    it('should display a header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML).contains('Check account details', 'Could not find the header');
    });

    it('should display correct summary keys and actions', async () => {
      const listKeys = htmlRes.getElementsByClassName('govuk-summary-list__key');
      const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');
      for (let i = 0; i < summaryKeys.length; i++) {
        expect(listKeys[i].innerHTML).to.contain(summaryKeys[i], `Unable to find ${summaryKeys[i]} summary key`);
        expect(actions[i].getElementsByClassName('govuk-link')[0].innerHTML).to.contain('Change');
        expect(actions[i].getElementsByClassName('govuk-link')[0].getAttribute('href')).to.equal(`create-system-admin-account#${changeValues[i]}`);
      }
    });

    it('should display correct summary values', async () => {
      const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
      expect(values[0].innerHTML).to.contain(cookie.firstName, 'First name value not found');
      expect(values[1].innerHTML).to.contain(cookie.lastName, 'Last name value not found');
      expect(values[2].innerHTML).to.contain(cookie.emailAddress, 'Email address value not found');
    });

    it('should display confirm button', async () => {
      const confirmButton = htmlRes.getElementsByClassName('govuk-button')[0];
      expect(confirmButton.innerHTML).to.contain('Confirm', 'Unable to find confirm button');
    });
  });

  describe('on POST', () => {

    const errorResponse = {
      firstName: 'Test',
      lastname: 'Name',
      email: 'EmailAddress',
      error: 'Error',
    };

    describe('with errors', () => {
      beforeAll(async () => {
        createAccountStub.resolves(errorResponse);
        app.request['cookies'] = {
          createAdminAccount: JSON.stringify(cookie),
        };
        app.request['user'] = {
          emails: ['TestEmail'],
          '_json': {
            'extension_UserRole': 'SYSTEM_ADMIN',
          },
        };
        await request(app).post(PAGE_URL).then(res => {
          htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
          htmlRes.getElementsByTagName('div')[0].remove();
        });
      });

      it('should display error dialog', () => {
        const errorDialog = htmlRes.getElementsByClassName('govuk-error-summary');
        const errorSummaryList = htmlRes.getElementsByClassName('govuk-error-summary__list')[0];
        expect(errorDialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML)
          .contains('There is a problem', 'Could not find error dialog title');
        expect(errorSummaryList.innerHTML).contains('A system error has occurred while submitting the application. Please try again');
      });
    });
  });
});
