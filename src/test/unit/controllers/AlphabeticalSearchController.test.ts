import sinon from 'sinon';
import { Response } from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';

import { mockRequest } from '../mocks/mockRequest';
import { FilterService } from '../../../main/service/FilterService';

const alphabeticalSearchController = new AlphabeticalSearchController();

const expectedFilters = {
    alphabetisedList: {},
    filterOptions: {},
    showFilters: {
        Jurisdiction: true,
        Civil: false,
        Crime: false,
        Family: false,
        Tribunal: false,
        Region: true,
    },
};

sinon.stub(FilterService.prototype, 'handleFilterInitialisation').resolves(expectedFilters);

const i18n = {
    'alphabetical-search': { title: 'A-Z search' },
    'location-name-search': { title: 'Location name search' },
};

describe('Alphabetical Search Controller', () => {
    const request = mockRequest(i18n);
    const expectedData = {
        ...i18n['alphabetical-search'],
        filters: expectedFilters,
    };

    describe('get', () => {
        it('should render the alphabetical search page', () => {
            const response = {
                render: function () {
                    return '';
                },
            } as unknown as Response;

            request.query = {};
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'alphabetical-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render the alphabetical search page with a query param', () => {
            const response = {
                render: function () {
                    return '';
                },
            } as unknown as Response;

            request.query = { clear: 'all' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('alphabetical-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'alphabetical-search').then(() => {
                responseMock.verify();
            });
        });
    });
    describe('post', () => {
        const response = {
            redirect: function () {
                return '';
            },
        } as unknown as Response;

        it('should render page with body', () => {
            request.body = { Jurisdiction: 'Manchester' };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('alphabetical-search?filterValues=Manchester');

            return alphabeticalSearchController.post(request, response, 'alphabetical-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render page after switching Region for Location', () => {
            request.body = { Region: 'Crown' };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('alphabetical-search?filterValues=Crown');

            return alphabeticalSearchController.post(request, response, 'alphabetical-search').then(() => {
                responseMock.verify();
            });
        });
    });
});

describe('Location Name Search Controller', () => {
    const request = mockRequest(i18n);
    const expectedData = {
        ...i18n['location-name-search'],
        filters: expectedFilters,
    };

    describe('GET requests', () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        it('should render court name search page', () => {
            request.query = {};

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if invalid query param is provided', () => {
            request.query = { foo: 'blah' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if reset all filters is applied', () => {
            request.query = { clear: 'all' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if reset crown jurisdiction filter is applied', () => {
            request.query = { clear: 'crown' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if reset london location filter is applied', () => {
            request.query = { clear: 'london' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            return alphabeticalSearchController.get(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page when jurisdiction element is removed', async () => {
            request.query = { clear: 'crown', filterValues: 'crown' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            await alphabeticalSearchController.get(request, response, 'location-name-search');
            responseMock.verify();
        });

        it('should render court name search page when region element is removed', async () => {
            request.query = { clear: 'london', filerValues: 'london' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            await alphabeticalSearchController.get(request, response, 'location-name-search');
            responseMock.verify();
        });

        it('should render court name search page when one jurisdiction is removed and there are still other jurisdiction filters', async () => {
            request.query = {
                clear: 'crown court',
                filterValues: 'crown,crown court',
            };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('location-name-search', expectedData);

            await alphabeticalSearchController.get(request, response, 'location-name-search');
            responseMock.verify();
        });
    });

    describe('POST requests', () => {
        const response = {
            redirect: () => {
                return '';
            },
        } as unknown as Response;
        it('should render court name search page if filters are applied', () => {
            request.body = { jurisdiction: [], region: [] };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-name-search?filterValues=');

            return alphabeticalSearchController.post(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if more than 2 filters are applied', () => {
            request.body = { jurisdiction: ['crown'], region: ['london'] };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-name-search?filterValues=crown,london');

            return alphabeticalSearchController.post(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if only jurisdiction filter is applied', () => {
            request.body = { jurisdiction: ['crown'] };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-name-search?filterValues=crown');

            return alphabeticalSearchController.post(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if only region filter is applied', () => {
            request.body = { region: ['london'] };

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-name-search?filterValues=london');

            return alphabeticalSearchController.post(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });

        it('should render court name search page if no filters are applied', () => {
            request.body = {};

            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-name-search?filterValues=');

            return alphabeticalSearchController.post(request, response, 'location-name-search').then(() => {
                responseMock.verify();
            });
        });
    });

    describe('On POST request for location selection confirmation', () => {
        it('should render pending subscription page once location is selected', () => {
            const response = {
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('/pending-subscriptions');

            return alphabeticalSearchController.locationSubscriptionsConfirmation(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
