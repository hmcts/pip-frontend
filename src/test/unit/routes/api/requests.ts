import request from 'supertest';
import { app } from '../../../../main/app';

const mockData = {
  hearingId: 5,
  courtId: 9,
  date: '1/9/2021',
  time: '8:29 AM',
  judge: 'Judge Brigida Francioli',
  platform: 'Microsoft Teams',
  caseNumber: '74-363-1243',
  caseName: "Hansen-Trantow's Hearing",
};

describe('API - /api/courts/list', () => {
  describe('on GET', () => {
    it('should return 200 status code', async() => {
      await request(app)
        .get('/api/courts/list')
        .expect((response) => expect(response.status).toBe(200));
    });

    it('should return list of 100 courts', async() => {
      await request(app)
        .get('/api/courts/list')
        .expect((response) => expect(response.body.length).toBe(100));
    });
  });
});

describe('API - /api/court/10', () => {
  describe('on GET', () => {
    let response;
    it('should return 200 status code', async() => {
      response = await request(app)
        .get('/api/court/10')
        .expect((response) => expect(response.status).toBe(200));
    });

    it('should return court object with id 10', () => {
      expect(response.body.courtId).toBe(10);
    });

    it('court name should be Polzela Court', () => {
      expect(response.body.name).toBe('Polzela Court');
    });

    it('number of hearings should be 2', () => {
      expect(response.body.hearings).toBe(2);
    });
  });
});

describe('API - /api/hearing/5', () => {
  describe('on GET', () => {
    let response;

    it('should return 200 status code', async() => {
      response = await request(app)
        .get('/api/hearing/5')
        .expect((response) => expect(response.status).toBe(200));
    });

    it('should return hearing object with hearingId 5', () => {
      expect(response.body.hearingId).toBe(5);
    });

    it('response should match mocked object', () => {
      expect(response.body).toStrictEqual(mockData);
    });
  });
});

describe('API - /api/hearings/9', () => {
  describe('on GET', () => {
    let response;

    it('should return 200 status code', async() => {
      response = await request(app)
        .get('/api/hearings/9')
        .expect((response) => expect(response.status).toBe(200));
    });

    it('should return list of 2 hearings for court with id 9', () => {
      expect(response.body.length).toBe(2);
    });

    it('should have mocked object in the hearings list', () => {
      expect(response.body.filter((hearings) => hearings.caseNumber === mockData.caseNumber).length).toBe(1);
    });

    it('should have only hearings for court id 9', () => {
      expect(response.body.filter((hearings) => hearings.courtId === 9).length).toBe(response.body.length);
    });
  });
});

