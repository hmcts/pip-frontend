import sinon from 'sinon';
import { Request, Response } from 'express';
import AlphabeticalSearchController from '../../../main/controllers/AlphabeticalSearchController';

describe('Alphabetical Search Controller', () => {
  it('should render the alphabetical search page', () =>  {
    const alphabeticalSearchController = new AlphabeticalSearchController();

    const response = {
      render: function() {return '';},
      get: function() {return 'abcd abcd;script-src abcd';},
      set: function() {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('alphabetical-search');

    alphabeticalSearchController.get(request, response);

    responseMock.verify();
  });

  //Add one more test to check the court list component

});
