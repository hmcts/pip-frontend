import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

let htmlRes: Document;
const PAGE_URL = '/delete-subscription?subscription=ValidSubscription';
const buttonClass = 'govuk-button';
const expectedButtonText = 'Continue';
const expectedHeaderText = 'Are you sure you want to remove this subscription?';
const radioClass = 'govuk-radios__item';
const expectedRadioLabel1 = 'Yes';
const expectedRadioLabel2 = 'No';

app.request['user'] = { roles: 'VERIFIED' };

describe('Delete Subscription page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(expectedHeaderText, 'Could not find correct value in header');
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName(buttonClass);
        expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });

    it('should display 2 radio buttons with valid labels', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons.length).equal(2, '2 radio buttons not found');
        expect(radioButtons[0].innerHTML).contains(
            expectedRadioLabel1,
            `Could not find the radio button with label ${expectedRadioLabel1}`
        );
        expect(radioButtons[1].innerHTML).contains(
            expectedRadioLabel2,
            `Could not find the radio button with label ${expectedRadioLabel2}`
        );
    });
});
