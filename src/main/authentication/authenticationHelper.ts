//This class is required, to remove circular dependencies between SessionManagementService and AuthenticationHandler
//Shared config / functions, used across both classes should be placed in here

export const adminAccountCreationRoles = ['SYSTEM_ADMIN', 'INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_SUPER_ADMIN_LOCAL'];
export const manualUploadRoles = [
    'SYSTEM_ADMIN',
    'INTERNAL_SUPER_ADMIN_CTSC',
    'INTERNAL_SUPER_ADMIN_LOCAL',
    'INTERNAL_ADMIN_CTSC',
    'INTERNAL_ADMIN_LOCAL',
];
export const mediaAccountCreationRoles = ['INTERNAL_SUPER_ADMIN_CTSC', 'INTERNAL_ADMIN_CTSC'];
export const systemAdminRoles = ['SYSTEM_ADMIN'];
export const allAdminRoles = [
    'SYSTEM_ADMIN',
    'INTERNAL_SUPER_ADMIN_CTSC',
    'INTERNAL_SUPER_ADMIN_LOCAL',
    'INTERNAL_ADMIN_CTSC',
    'INTERNAL_ADMIN_LOCAL',
];
export const verifiedRoles = ['VERIFIED'];

export function checkRoles(req, roles): boolean {
    if (req.user) {
        if (roles.includes(req.user['roles'])) {
            return true;
        }
    }
    return false;
}
