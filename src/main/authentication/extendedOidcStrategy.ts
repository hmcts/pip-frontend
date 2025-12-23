// @ts-ignore Ignore
import { Strategy } from 'openid-client/passport';

/**
 * Extended the OIDC Strategy class to allow for custom query parameters in the outbound request
 */
export class OIDCStrategy extends Strategy {
    constructor(options, callback) {
        super(options, callback);
    }

    /**
     * Overrides the default authorizationRequestParams to allow for custom locale query parameter.
     *
     * @param req The inbound request.
     * @param options The request options passed into the passport authenticate method in the routes file.
     */
    authorizationRequestParams(req, options) {
        const params = super.authorizationRequestParams(req, options);
        params.set('ui_locales', options['locale']);
        return params;
    }
}
