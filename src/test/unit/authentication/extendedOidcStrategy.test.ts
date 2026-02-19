import { OIDCStrategy } from '../../../main/authentication/extendedOidcStrategy';

// Remove the global mock for extendedOidcStrategy to use the real class in this test file
jest.unmock('../../../main/authentication/extendedOidcStrategy');

jest.mock('openid-client/passport', () => {
    class MockStrategy {
        constructor() {}
        authorizationRequestParams() {
            return new Map([['existing', 'value']]);
        }
    }
    return { Strategy: MockStrategy };
});

describe('OIDCStrategy', () => {
    let strategy: OIDCStrategy;

    beforeEach(() => {
        strategy = new OIDCStrategy({}, jest.fn());
    });

    it('should construct without error', () => {
        expect(strategy).toBeInstanceOf(OIDCStrategy);
    });

    it('should add ui_locales param from options.locale', () => {
        const req = {};
        const options = { locale: 'cy' };

        const parentSpy = jest.spyOn(Object.getPrototypeOf(OIDCStrategy.prototype), 'authorizationRequestParams');

        const result = strategy.authorizationRequestParams(req, options);

        expect(parentSpy).toHaveBeenCalledWith(req, options);
        expect(result.get('ui_locales')).toBe('cy');
        expect(result.get('existing')).toBe('value');
    });
});
