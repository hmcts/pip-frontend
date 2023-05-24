import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/info';
let response;

describe('Info page', () => {
    describe('JSON response', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    response = res.text;
                });
        });

        it('should contain service name', () => {
            expect(response).contains('court-and-tribunal-hearings-service', 'Could not find application name');
        });

        it('should contain uptime field', () => {
            expect(response).contains('uptime', 'could not find the uptime field');
        });
    });
});
