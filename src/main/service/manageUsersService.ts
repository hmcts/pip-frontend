import moment from 'moment';

export class ManageUsersService {

  public formatUserData(originalData: any, mediaUser: boolean): any {
    const allUserArray = [];
    if(originalData.length > 0) {
      originalData.forEach(user => {
        const userArray = [];
        userArray.push({text: user.email});
        userArray.push({text: this.formatProvenance(user.userProvenance)});
        userArray.push({text: moment(user.createdDate).format('D/M/YY H:m')});

        if (mediaUser) {
          userArray.push({text: moment(user.lastVerifiedDate).format('D/M/YY H:m')});
        } else {
          userArray.push({text: moment(user.lastSignedInDate).format('D/M/YY H:m')});
        }
        const link = `<a class="govuk-link" href="manage-user?id=${user.userId}">Manage user</a>`;
        userArray.push({html: link});

        allUserArray.push(userArray);
      });
    }
    return allUserArray;
  }

  private formatProvenance(provenance: string) {
    if(provenance === 'PI_AAD') {
      return 'AAD';
    } else if(provenance === 'CFT_IDAM') {
      return 'CFT IdAM';
    } else if(provenance === 'CRIME_IDAM') {
      return 'Crime IdAM';
    } else {
      return provenance;
    }
  }

}
