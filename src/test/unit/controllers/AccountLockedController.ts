import sinon from 'sinon';
import { Request, Response } from 'express';
import AccountLockedController from "../../../main/controllers/AccountLockedController";

describe('Account Locked Controller', () => {
  it('should render the account locked page', () =>  {
    const accountLockedController = new AccountLockedController();

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('account-locked');

    accountLockedController.get(request, response);

    responseMock.verify();
  });

});
