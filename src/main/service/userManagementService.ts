import {AccountManagementRequests} from '../resources/requests/accountManagementRequests';

const accountManagementRequests = new AccountManagementRequests();
export class UserManagementService {
  /**
   * Returns the headers for the user management table.
   */
  public getTableHeaders() {
    return [{text: 'Email', classes: 'govuk-!-padding-top-0'}, {text: 'Role', classes: 'govuk-!-padding-top-0'},
      {text: 'Provenance', classes: 'govuk-!-padding-top-0'}, {text: '', classes: 'govuk-!-padding-top-0'}];
  }

  /**
   * Return all the formatted data the user management screen requires
   * @param pageNumber The page number to get the users from.
   */
  public async getFormattedData(pageNumber: number, email: string, userId: string, userProvenanceId: string, roles: string,
    provenances: string) {
    const rawData = await accountManagementRequests.getAllAccountsExceptThirdParty((pageNumber - 1), 25);
    const builtFilters = this.buildFilters(email, userId, userProvenanceId, roles, provenances);
    return {
      paginationData: this.formatPaginationData(rawData?.number, rawData?.totalPages, rawData?.first, rawData?.last),
      userData: this.formatPageData(rawData?.content),
      emailFieldData: builtFilters['emailField'],
      userIdFieldData: builtFilters['userIdField'],
      userProvenanceIdFieldData: builtFilters['userProvenanceIdField'],
      provenancesFieldData: builtFilters['provenancesField'],
      rolesFieldData: builtFilters['rolesField'],
    };
  }

  /**
   * Formats the returned user data into the correct format for the frontend table.
   * @param rawData The raw user data.
   */
  private formatPageData(rawData: any) {
    const allUserArray = [];
    if (rawData.length > 0) {
      rawData.forEach(user => {
        const userArray = [];
        userArray.push({text: user.email});
        userArray.push({text: this.formatRoles(user.roles)});
        userArray.push({text: this.formatProvenance(user.userProvenance)});
        userArray.push({html: `<a class="govuk-link" href="manage-user?id=${user.userId}">Manage</a>`});
        allUserArray.push(userArray);
      });
    }
    return allUserArray;
  }

  /**
   * Formats the object required for the pagination component in the frontend.
   * @param currentPage This is one less than the frontend displays as index starts from 0 on the API rather than 1.
   * @param finalPage The final page number.
   * @param first This is a boolean for if the current page is the first page.
   * @param last This is a boolean for if the current page is the last page.
   */
  private formatPaginationData(currentPage: number, finalPage: number, first: boolean, last: boolean) {
    const paginationObject = {
      previous: null,
      next: null,
    };

    if(!first) {
      paginationObject.previous = {
        labelText: (currentPage) + ' of ' + finalPage,
        href: '?page=' + (currentPage),
      };
    }

    if (!last) {
      paginationObject.next = {
        labelText: (currentPage + 2) + ' of ' + finalPage,
        href: '?page=' + (currentPage + 2),
      };
    }

    return paginationObject;
  }

  /**
   * Takes in a raw role and formats it. TODO TIDY UP
   * @param rawRole
   * @private
   */
  private formatRoles(rawRole: string): string {
    switch(rawRole) {
      case 'VERIFIED':
        return 'Media';
      case 'INTERNAL_SUPER_ADMIN_CTSC':
        return 'CTSC Super Admin';
      case 'SYSTEM_ADMIN':
        return 'System Admin';
      case 'INTERNAL_ADMIN_LOCAL':
        return 'Local Admin';
      case 'INTERNAL_SUPER_ADMIN_LOCAL':
        return 'Local Super Admin';
      case 'INTERNAL_ADMIN_CTSC':
        return 'CTSC Admin';
      default:
        return rawRole;
    }
  }

  /**
   * TIDY UP>>>>> TODO
   * @param rawProvenance
   * @private
   */
  private formatProvenance(rawProvenance) {
    switch(rawProvenance) {
      case 'PI_AAD':
        return 'B2C';
      case 'CRIME_IDAM':
        return 'Crime IdAM';
      case 'CFT_IDAM':
        return 'CFT IdAM';
      default:
        return rawProvenance;
    }
  }

  public generateFilterKeyValues(body: string) {
    const filterValues = [];
    Object.keys(body).forEach(key => {
      if(body[key].length > 0) {
        let separator = '&';
        if (filterValues.length === 0) {
          separator = '';
        }
        filterValues.push(separator + key + '=' + body[key]);
      }
    });

    return filterValues.join('');
  }

  private buildFilters(email: string, userId: string, userProvenanceId: string, roles: string,
    provenances: string) {

    // Build the email input field
    const emailField = {
      id: 'email',
      name: 'email',
      label: {
        text: 'Email',
        classes: 'govuk-label--m',
      },
      value: email,
    };

    // Build the user id input field
    const userIdField = {
      id: 'userId',
      name: 'userId',
      label: {
        text: 'User ID',
        classes: 'govuk-label--m',
      },
      hint: {
        text: 'Must be an exact match',
      },
      value: userId,
    };

    // Build the user provenance id input field
    const userProvenanceIdField = {
      id: 'userProvenanceId',
      name: 'userProvenanceId',
      label: {
        text: 'User Provenance ID',
        classes: 'govuk-label--m',
      },
      hint: {
        text: 'Must be an exact match',
      },
      value: userProvenanceId,
    };

    // Build the provenance checkbox selection field
    const provenancesField = {
      idPrefix: 'provenances',
      name: 'provenances',
      classes: 'govuk-checkboxes--small',
      fieldSet: {
        legend: {
          text: 'Provenance',
          classes: 'govuk-label--m',
        },
      },
      items: [
        {
          value: 'PI_AAD',
          text: 'B2C',
          checked: provenances.includes('PI_AAD'),
        },
        {
          value: 'CFT_IDAM',
          text: 'CFT IdAM',
          checked: provenances.includes('CFT_IDAM'),
        },
        {
          value: 'CRIME_IDAM',
          text: 'Crime IdAM',
          checked: provenances.includes('CRIME_IDAM'),
        },
      ],
    };

    // Build the roles checkbox selection field
    const rolesField = {
      idPrefix: 'roles',
      name: 'roles',
      classes: 'govuk-checkboxes--small',
      fieldSet: {
        legend: {
          text: 'Role',
          classes: 'govuk-label--m',
        },
      },
      items: [
        {
          value: 'VERIFIED',
          text: 'Media',
          checked: roles.includes('VERIFIED'),
        },
        {
          value: 'INTERNAL_ADMIN_LOCAL',
          text: 'Local Admin',
          checked: roles.includes('INTERNAL_ADMIN_LOCAL'),
        },
        {
          value: 'INTERNAL_ADMIN_CTSC',
          text: 'CTSC Admin',
          checked: roles.includes('INTERNAL_ADMIN_CTSC'),
        },
        {
          value: 'INTERNAL_SUPER_ADMIN_LOCAL',
          text: 'Local Super Admin',
          checked: roles.includes('INTERNAL_SUPER_ADMIN_LOCAL'),
        },
        {
          value: 'INTERNAL_SUPER_ADMIN_CTSC',
          text: 'CTSC Super Admin',
          checked: roles.includes('INTERNAL_SUPER_ADMIN_CTSC'),
        },
        {
          value: 'SYSTEM_ADMIN',
          text: 'System Admin',
          checked: roles.includes('SYSTEM_ADMIN'),
        },
      ],
    };

    return {
      emailField,
      userIdField,
      userProvenanceIdField,
      provenancesField,
      rolesField,
    };
  }
}

