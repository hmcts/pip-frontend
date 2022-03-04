import { request as expressRequest } from 'express';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { PublicationService } from '../../../main/service/publicationService';
import { expect } from 'chai';

const PAGE_URL = '/remove-list-confirmation?artefact=18dec6ee-3a30-47bb-9fb3-6a343d6b9efb&court=10';
sinon.stub(expressRequest, 'isAuthenticated').returns(true);
sinon.stub(PublicationService.prototype, 'removePublication').withArgs('foo').resolves(false);

let htmlRes: Document;

describe('Remove List Confirmation Page', () => {
  describe('without error', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML).contains('Are you sure you want to remove this content?', 'Could not find correct value in header');
    });

    it('should display 2 radio options with valid values', () => {
      const radios = htmlRes.getElementsByClassName('govuk-radios__input');
      expect(radios.length).equals(2, 'Could not find all radio buttons');
      expect(radios[0].getAttribute('value')).equals('yes', 'Could not find valid radio value');
      expect(radios[1].getAttribute('value')).equals('no', 'Could not find valid radio value');
    });

    it('should display continue button',  () => {
      const buttons = htmlRes.getElementsByClassName('govuk-button');
      expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
    });
  });

  describe('with error', () => {
    beforeAll(async () => {
      await request(app).post(PAGE_URL).send({courtId: '5', artefactId: 'foo'}).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display error summary', () => {
      const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
      expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML)
        .contains('There is a problem', 'Could not find error dialog title');
    });

    it('should display error messages in the summary', () => {
      const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
      const listItems = list.getElementsByTagName('a');
      expect(listItems[0].innerHTML).contains('Please select an option', 'Could not find error');
    });
  });
});
