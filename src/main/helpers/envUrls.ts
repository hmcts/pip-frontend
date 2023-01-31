import process from 'process';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'https://pip-frontend.staging.platform.hmcts.net';
export const B2C_URL = process.env.B2C_URL || 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com';
export const B2C_ADMIN_URL =
    process.env.B2C_ADMIN_URL || 'https://hmctspipnonprod.b2clogin.com/hmctspipnonprod.onmicrosoft.com';
export const AUTH_RETURN_URL =
    process.env.AUTH_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/login/return';
export const ADMIN_AUTH_RETURN_URL =
    process.env.ADMIN_AUTH_RETURN_URL || 'https://pip-frontend.staging.platform.hmcts.net/login/admin/return';
export const MEDIA_VERIFICATION_RETURN_URL =
    process.env.MEDIA_VERIFICATION_RETURN_URL ||
    'https://pip-frontend.staging.platform.hmcts.net/media-verification/return';
export const CFT_IDAM_URL = process.env.CFT_IDAM_URL || 'https://idam-web-public.aat.platform.hmcts.net';

export const urlPath = url => {
    return url.substring(0, url.includes('?') ? url.indexOf('?') : url.length).replace(/^\//, '');
};
